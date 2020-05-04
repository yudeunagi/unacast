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
import getRes, { getResInterval } from './getRes';
import { CommentItem } from './youtube-chat/parser';
import bouyomiChan from './bouyomi-chan';
import { exec } from 'child_process';
import { electronEvent } from './const';

let app: expressWs.Instance['app'];

// サーバーをグローバル変数にセットできるようにする（サーバー停止処理のため）
let server: http.Server;

/** 棒読みちゃんインスタンス */
let bouyomi: bouyomiChan;

/** スレッド定期取得のイベント */
let threadIntervalEvent: ReturnType<typeof setInterval>;

/** キュー処理実行するか */
let isExecuteQue = false;

/**
 * サーバー起動
 * config:設定を格納したjson、以下jsonの中身
 * url:掲示板URL
 * resNumber:読み込み開始レス位置
 * port:ポート番号
 */
ipcMain.on(electronEvent['start-server'], async (event: any, config: typeof globalThis['config']) => {
  app = expressWs(express()).app;
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

  const id = new Date().getTime();
  app.get('/id', (req: Request, res: Response, next) => {
    res.send(`${id}`);
  });

  // 静的コンテンツはpublicディレクトリの中身を使用するという宣言
  app.use(express.static(path.resolve(__dirname, '../public')));

  // 2ch互換掲示板の取得
  app.use('/getRes', getRes);

  // SEを取得する
  if (globalThis.config.playSe) {
    const list = await readWavFiles(globalThis.config.sePath);
    globalThis.electron.seList = list.map((file) => `${globalThis.config.sePath}/${file}`);
    console.log(`SE files = ${globalThis.electron.seList.length}`);
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
  threadIntervalEvent = setInterval(() => getResInterval(), globalThis.config.interval * 1000);

  // キュー処理の開始
  isExecuteQue = true;
  taskScheduler();

  // WebSocketを立てる
  app.ws('/ws', (ws, req) => {
    globalThis.electron.socket = ws as any;
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

const startTwitchChat = async () => {
  try {
    const twitchChat = new ChatClient();
    twitchChat.connect();
    twitchChat.join(globalThis.config.twitchId);
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
  app = null as any;
  event.returnValue = 'stop';

  // キュー処理停止
  isExecuteQue = false;
  globalThis.electron.commentQueueList = [];

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

  // レス取得の停止
  if (threadIntervalEvent) {
    clearInterval(threadIntervalEvent);
  }
});

/**
 * キューに溜まったコメントを処理する
 */
const taskScheduler = async () => {
  // log.info('taskScheduler');
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

  if (isExecuteQue) {
    await sleep(100);
    taskScheduler();
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
    if (globalThis.electron.socket) globalThis.electron.socket.send(domStr);

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
  } catch (e) {
    log.error(e);
  }
};

export default {};
