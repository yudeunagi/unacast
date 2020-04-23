import http from 'http';
import path from 'path';
import express, { Request, Response } from 'express';
import log from 'electron-log';
import { ChatClient } from 'dank-twitch-irc';
import { LiveChat } from './youtube-chat';
import { ipcMain } from 'electron';
import expressWs from 'express-ws';
import { readWavFiles } from './util';
// レス取得APIをセット
import getRes from './getRes';
import { CommentItem } from './youtube-chat/parser';
import bouyomiChan from './bouyomi-chan';
import childProcess from 'child_process';
import { electronEvent } from './const';
const exec = childProcess.exec;

let app: expressWs.Instance['app'];

// サーバーをグローバル変数にセットできるようにする（サーバー停止処理のため）
let server: http.Server;

let bouyomi: bouyomiChan;

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
  //静的コンテンツはpublicディレクトリの中身を使用するという宣言
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
    globalThis.electron.twitchChat = new ChatClient();
    globalThis.electron.twitchChat.connect();
    globalThis.electron.twitchChat.join(globalThis.config.twitchId);
    globalThis.electron.twitchChat.on('PRIVMSG', (msg) => {
      const imgUrl = './img/twitch.png';
      const name = msg.displayName;
      const text = msg.messageText;
      sendDom({ name, text, imgUrl });
    });
  }

  // Youtubeチャット
  if (globalThis.config.youtubeId) {
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
        const imgUrl = comment.author.thumbnail?.url ?? '';
        const name = comment.author.name;
        const text = (comment.message[0] as any).text;
        sendDom({ name, text, imgUrl });
      });
      // // 何かエラーがあった
      globalThis.electron.youtubeChat.on('error', (err: Error) => {
        log.error('[Youtube Chat] error');
        log.error(err);
        globalThis.electron.youtubeChat.stop();
      });

      globalThis.electron.youtubeChat.start();
    } catch (e) {
      process.exit(1);
    }
  }

  // 棒読みちゃん接続
  if (config.typeYomiko === 'bouyomi') {
    if (config.bouyomiPort) {
      bouyomi = new bouyomiChan({ port: config.bouyomiPort, volume: config.bouyomiVolume });
    }
  }

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

/**
 * サーバー停止
 */
ipcMain.on(electronEvent['stop-server'], (event) => {
  console.log('[startServer]server stop');
  server.close();
  app = null as any;
  event.returnValue = 'stop';

  if (globalThis.electron.twitchChat) {
    globalThis.electron.twitchChat.close();
    globalThis.electron.twitchChat.removeAllListeners();
  }

  if (globalThis.electron.youtubeChat) {
    globalThis.electron.youtubeChat.stop();
    globalThis.electron.youtubeChat.removeAllListeners();
  }
});

// 棒読みちゃん
ipcMain.on(electronEvent['play-tamiyasu'], (event, args: string) => {
  switch (config.typeYomiko) {
    case 'tamiyasu': {
      exec(`${config.tamiyasuPath} ${args}`);
      break;
    }
    case 'bouyomi': {
      if (bouyomi) bouyomi.speak(args);
      break;
    }
  }
});

export const createDom = (message: UserComment) => {
  let domStr = `
  <li class="list-item">
    <span class="icon-block">
      <img class="icon" src="${message.imgUrl}">
    </span>
  <div class="content">`;

  //レス番表示
  if (globalThis.config.showNumber) {
    domStr += `
      <span class="resNumber">${message.number}</span>
    `;
  }
  // 名前表示
  if (globalThis.config.showName) {
    domStr += `<span class="name">${message.name}</span>`;
  }
  // 時刻表示
  if (globalThis.config.showTime) {
    domStr += `<span class="date">${message.date}</span>`;
  }

  // 名前と本文を改行で分ける
  if (globalThis.config.newLine) {
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
export const sendDom = (message: UserComment) => {
  const domStr = createDom(message);
  if (globalThis.electron.socket) globalThis.electron.socket.send(domStr);

  if (config.playSe && globalThis.electron.seList.length > 0) {
    const wavfilepath = globalThis.electron.seList[Math.floor(Math.random() * globalThis.electron.seList.length)];
    globalThis.electron.mainWindow.webContents.send(electronEvent['play-sound'], { wavfilepath, text: message.text });
  } else if (globalThis.config.typeYomiko !== 'none') {
    // レス着信音OFF + レス読み
    ipcMain.emit(electronEvent['play-tamiyasu'], null, message.text);
  }
};

export default {};
