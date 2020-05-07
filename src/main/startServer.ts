import http from 'http';
import path from 'path';
import express, { Request, Response } from 'express';
import log from 'electron-log';
import { ChatClient } from 'dank-twitch-irc';
import { LiveChat } from './youtube-chat';
import { ipcMain } from 'electron';
import expressWs from 'express-ws';
import { readWavFiles, sleep } from './util';
// レス取得APIをセット
import getRes, { getRes as getBbsResponse } from './getRes';
import { CommentItem } from './youtube-chat/parser';
import bouyomiChan from './bouyomi-chan';
import { exec } from 'child_process';
import { electronEvent } from './const';

let app: expressWs.Instance['app'];

// サーバーをグローバル変数にセットできるようにする（サーバー停止処理のため）
let server: http.Server;

/** 棒読みちゃんインスタンス */
let bouyomi: bouyomiChan;

/** スレッド定期取得実行するか */
let threadIntervalEvent = false;

/** キュー処理実行するか */
let isExecuteQue = false;

/** 接続中の全WebSocket */
let aWss: ReturnType<expressWs.Instance['getWss']>;

let serverId = 0;

/**
 * 設定の適用
 */
ipcMain.on(electronEvent['apply-config'], async (event: any, config: typeof globalThis['config']) => {
  log.info('[apply-config] start');
  log.info(config);

  // Configの変更内容に応じて何かする
  const isChangedUrl = globalThis.config.url !== config.url;
  const isChangeSePath = globalThis.config.sePath !== config.sePath;
  globalThis.config = config;

  // 着信音のパス
  if (isChangeSePath) {
    await findSeList();
  }

  // initメッセージ
  resetInitMessage();

  // スレのURL
  if (isChangedUrl) {
    // 新スレを取得
    const ret = await getBbsResponse(globalThis.config.url, NaN);
    console.log(ret);
    if (ret.length === 0) {
      globalThis.electron.mainWindow.webContents.send(electronEvent['show-alert'], '掲示板URLがおかしそうです');
      return;
    }
    globalThis.electron.threadNumber = Number(ret[ret.length - 1].number);
    log.info(`[apply-config] new res num is ${globalThis.electron.threadNumber}`);
    // チャットウィンドウとブラウザに、末尾のスレだけ反映する
    sendDom([ret[ret.length - 1]]);
  }
});

/**
 * サーバー起動
 */
ipcMain.on(electronEvent['start-server'], async (event: any, config: typeof globalThis['config']) => {
  globalThis.electron.chatWindow.webContents.send(electronEvent['clear-comment']);
  globalThis.electron.threadNumber = 0;
  globalThis.electron.commentQueueList = [];
  globalThis.electron.threadConnectionError = 0;
  serverId = new Date().getTime();

  const expressInstance = expressWs(express());
  app = expressInstance.app;
  aWss = expressInstance.getWss();

  app.set('view engine', 'ejs');
  // viewディレクトリの指定
  app.set('views', path.resolve(__dirname, '../views'));

  // 設定情報をグローバル変数へセットする
  globalThis.config = config;

  console.log('[startServer]設定値 = ');
  console.log(globalThis.config);

  app.get('/', (req: Request, res: Response, next) => {
    res.render('server', config);
    req.connection.end();
  });

  // サーバー設定のIF
  app.get('/config', (req: Request, res: Response, next) => {
    res.send(JSON.stringify(globalThis.config));
  });

  // 静的コンテンツはpublicディレクトリの中身を使用するという宣言
  app.use(express.static(path.resolve(__dirname, '../public')));

  // 2ch互換掲示板の取得
  app.use('/getRes', getRes);

  // SEを取得する
  if (globalThis.config.sePath) {
    findSeList();
  }

  // Twitchに接続
  if (globalThis.config.twitchId) {
    startTwitchChat();
  }

  // Youtubeチャット
  if (globalThis.config.youtubeId) {
    startYoutubeChat();
  }

  // 棒読みちゃん接続
  if (config.typeYomiko === 'bouyomi') {
    if (config.bouyomiPort) {
      bouyomi = new bouyomiChan({ port: config.bouyomiPort, volume: config.bouyomiVolume });
    }
  }

  // レス取得定期実行
  threadIntervalEvent = true;
  getResInterval(serverId);

  // キュー処理の開始
  isExecuteQue = true;
  taskScheduler(serverId);

  // WebSocketを立てる
  app.ws('/ws', (ws, req) => {
    ws.on('message', (message) => {
      console.trace('Received: ' + message);
      if (message === 'ping') {
        ws.send('pong');
      }
    });

    ws.on('close', () => {
      console.log('I lost a client');
    });
  });

  // 指定したポートで待ち受け開始
  server = app.listen(config.port, () => {
    console.log('[startServer] start server on port:' + config.port);
  });
  // 成功メッセージ返却
  event.returnValue = 'success';
});

export const findSeList = async () => {
  try {
    if (globalThis.config.sePath) {
      const list = await readWavFiles(globalThis.config.sePath);
      globalThis.electron.seList = list.map((file) => `${globalThis.config.sePath}/${file}`);
      console.log(`SE files = ${globalThis.electron.seList.length}`);
    } else {
      globalThis.electron.seList = [];
    }
  } catch (e) {
    globalThis.electron.mainWindow.webContents.send(electronEvent['show-alert'], '着信音のパスがおかしそうです');
  }
};

/**
 * Twitchチャットに接続
 * @description 再接続処理はライブラリが勝手にやってくれる
 */
const startTwitchChat = async () => {
  try {
    const twitchChat = new ChatClient();
    twitchChat.connect();
    twitchChat.join(globalThis.config.twitchId);
    // チャット受信
    twitchChat.on('PRIVMSG', (msg) => {
      const imgUrl = './img/twitch.png';
      const name = msg.displayName;
      const text = msg.messageText;
      globalThis.electron.commentQueueList.push({ imgUrl, name, text });
    });
    globalThis.electron.twitchChat = twitchChat;
  } catch (e) {
    log.error(e);
  }
};

/** Youtubeチャットに接続 */
const startYoutubeChat = async () => {
  try {
    console.log('[Youtube Chat] connect started');
    globalThis.electron.youtubeChat = new LiveChat({ channelId: globalThis.config.youtubeId });
    // 接続開始イベント
    globalThis.electron.youtubeChat.on('start', (liveId: string) => {
      console.log(`[Youtube Chat] connected liveId = ${liveId}`);
    });
    // 接続終了イベント
    globalThis.electron.youtubeChat.on('end', (reason?: string) => {
      console.log('[Youtube Chat] disconnect');
    });
    // チャット受信
    globalThis.electron.youtubeChat.on('comment', (comment: CommentItem) => {
      log.info('[Youtube] received');
      const imgUrl = comment.author.thumbnail?.url ?? '';
      const name = comment.author.name;
      const text = (comment.message[0] as any).text;
      globalThis.electron.commentQueueList.push({ imgUrl, name, text });
    });
    // 何かエラーがあった
    globalThis.electron.youtubeChat.on('error', (err: Error) => {
      log.error(`[Youtube Chat] error ${err.message}`);
      // log.error(err);
      // globalThis.electron.youtubeChat.stop();
    });

    const tubeResult = await globalThis.electron.youtubeChat.start();
    if (!tubeResult) {
      await sleep(5000);
      startYoutubeChat();
    }
  } catch (e) {
    // たぶんここには来ない
    log.error(e);
  }
};

/**
 * サーバー停止
 */
ipcMain.on(electronEvent['stop-server'], (event) => {
  console.log('[startServer]server stop');
  server.close();
  aWss.close();
  app = null as any;
  event.returnValue = 'stop';

  // キュー処理停止
  isExecuteQue = false;
  globalThis.electron.commentQueueList = [];

  // レス取得の停止
  threadIntervalEvent = false;
  // Twitchチャットの停止
  if (globalThis.electron.twitchChat) {
    globalThis.electron.twitchChat.close();
    globalThis.electron.twitchChat.removeAllListeners();
  }

  // Youtubeチャットの停止
  if (globalThis.electron.youtubeChat) {
    globalThis.electron.youtubeChat.stop();
    globalThis.electron.youtubeChat.removeAllListeners();
  }
});

const getResInterval = async (exeId: number) => {
  if (globalThis.electron.threadNumber > 0) {
    const result = await getBbsResponse(globalThis.config.url, globalThis.electron.threadNumber);
    // 指定したレス番は除外対象
    result.shift();
    if (result.length > 0 && result[result.length - 1].number) {
      globalThis.electron.threadNumber = Number(result[result.length - 1].number);
      for (const item of result) {
        // リストに同じレス番があったら追加しない
        if (!globalThis.electron.commentQueueList.find((comment) => comment.number === item.number)) {
          globalThis.electron.commentQueueList.push(item);
        }
      }
    }
    await notifyThreadResLimit();
  }

  if (threadIntervalEvent && exeId === serverId) {
    await sleep(globalThis.config.interval * 1000);
    getResInterval(exeId);
  }
};

/** レス番が上限かチェックして、超えてたら通知する */
const notifyThreadResLimit = async () => {
  if (globalThis.config.notifyThreadResLimit > 0 && globalThis.electron.threadNumber >= globalThis.config.notifyThreadResLimit) {
    globalThis.electron.commentQueueList.push({
      name: 'unacastより',
      imgUrl: './img/unacast.png',
      text: `レスが${globalThis.config.notifyThreadResLimit}を超えました。次スレを立ててください。`,
    });
    // 次スレ検索ポーリング処理を走らせる

    // スレ立て中だと思うのでちょっと待つ
    await sleep(10 * 1000);
  }
};

/**
 * キューに溜まったコメントを処理する
 */
const taskScheduler = async (exeId: number) => {
  if (globalThis.electron?.commentQueueList?.length > 0) {
    if (globalThis.config.commentProcessType === 0) {
      // 一括
      let temp = [...globalThis.electron.commentQueueList];
      globalThis.electron.commentQueueList = [];
      // 新着が上の場合は逆順にする
      if (!globalThis.config.dispSort) {
        temp = temp.reverse();
      }
      sendDom(temp);
    } else {
      // 1個ずつ
      const comment = globalThis.electron.commentQueueList.shift() as UserComment;
      await sendDom([comment]);
    }
  }

  if (isExecuteQue && exeId === serverId) {
    await sleep(100);
    taskScheduler(exeId);
  }
};

/** 読み子によって発話中であるか */
let isSpeaking = false;
/** 読み子を再生する */
const playYomiko = async (msg: string) => {
  // log.info('[playYomiko] start');
  isSpeaking = true;

  // 読み子呼び出し
  switch (config.typeYomiko) {
    case 'tamiyasu': {
      exec(`${config.tamiyasuPath} ${msg}`);
      break;
    }
    case 'bouyomi': {
      if (bouyomi) bouyomi.speak(msg);
      break;
    }
  }
  // 読み子が読んでる時間分相当待つ
  globalThis.electron.mainWindow.webContents.send(electronEvent['wait-yomiko-time'], msg);
  while (isSpeaking) {
    await sleep(50);
  }
  // log.info('[playYomiko] end');
};
ipcMain.on(electronEvent['speaking-end'], (event) => (isSpeaking = false));

let isPlayingSe = false;
const playSe = async () => {
  // log.info('[playSe] start');
  const wavfilepath = globalThis.electron.seList[Math.floor(Math.random() * globalThis.electron.seList.length)];
  isPlayingSe = true;
  globalThis.electron.mainWindow.webContents.send(electronEvent['play-sound-start'], wavfilepath);

  while (isPlayingSe) {
    await sleep(50);
  }
  // log.info('[playSe] end');
};
ipcMain.on(electronEvent['play-sound-end'], (event) => (isPlayingSe = false));

export const createDom = (message: UserComment) => {
  let domStr = `
  <li class="list-item">
    <span class="icon-block">
      <img class="icon" src="${message.imgUrl}">
    </span>
  <div class="content">`;

  let isResNameShowed = false;

  // レス番表示
  if (globalThis.config.showNumber && message.number) {
    domStr += `
      <span class="resNumber">${message.number}</span>
    `;
    isResNameShowed = true;
  }
  // 名前表示
  if (globalThis.config.showName && message.name) {
    domStr += `<span class="name">${message.name}</span>`;
    isResNameShowed = true;
  }
  // 時刻表示
  if (globalThis.config.showTime && message.date) {
    domStr += `<span class="date">${message.date}</span>`;
    isResNameShowed = true;
  }

  // 名前と本文を改行で分ける
  // 名前や時刻の行が一つも無ければ、改行しない
  if (globalThis.config.newLine && isResNameShowed) {
    domStr += '<br />';
  }

  domStr += `
    <span class="res">
      ${message.text}
    </span>
    </div>
  </li>`;

  return domStr;
};

/**
 * コメントのDOMをブラウザに送る
 * 必要ならレス着信音も鳴らす
 * @param message
 */
const sendDom = async (messageList: UserComment[]) => {
  try {
    // メッセージをブラウザに送信
    const domStr = messageList.map((message) => createDom(message)).join('\n');
    const socketObject: CommentSocketMessage = {
      type: 'add',
      message: domStr,
    };
    aWss.clients.forEach((client) => {
      client.send(JSON.stringify(socketObject));
    });

    // レンダラーのコメント一覧にも表示
    const domStr2 = messageList
      .map((message) => {
        const imgUrl = message.imgUrl && message.imgUrl.match(/^\./) ? '../../public/' + message.imgUrl : message.imgUrl;
        return {
          ...message,
          imgUrl,
        };
      })
      .map((message) => createDom(message))
      .join('\n');
    globalThis.electron.chatWindow.webContents.send(electronEvent['show-comment'], { config: globalThis.config, dom: domStr2 });

    // レス着信音
    if (config.playSe && globalThis.electron.seList.length > 0) {
      await playSe();
    }

    // 読み子
    if (globalThis.config.typeYomiko !== 'none') {
      await playYomiko(messageList[messageList.length - 1].text);
    }

    // 追加で表示を維持する時間
    if (globalThis.config.dispType === 1) {
      const MIN_DISP_TIME = 2.5 * 1000;
      await sleep(MIN_DISP_TIME);
    }

    // 鳴らし終わって読み子が終わった
    resetInitMessage();
  } catch (e) {
    log.error(e);
  }
};

const resetInitMessage = () => {
  if (globalThis.config.dispType === 1) {
    const resetObj: CommentSocketMessage = {
      type: 'reset',
      message: globalThis.config.initMessage,
    };
    aWss.clients.forEach((client) => {
      client.send(JSON.stringify(resetObj));
    });
  }
};

export default {};
