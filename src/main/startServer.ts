import http from 'http';
import path from 'path';
import express from 'express';
import log from 'electron-log';
import { ChatClient } from 'dank-twitch-irc';
import { ipcMain } from 'electron';
import expressWs from 'express-ws';
var app;

// レス取得APIをセット
import getRes from './getRes';

// サーバーをグローバル変数にセットできるようにする（サーバー停止処理のため）
var server: http.Server;

/**
 * サーバー起動
 * config:設定を格納したjson、以下jsonの中身
 * url:掲示板URL
 * resNumber:読み込み開始レス位置
 * port:ポート番号
 */
ipcMain.on('start-server', async (event: any, config: typeof globalThis['config']) => {
  app = expressWs(express()).app;
  const ejs = require('ejs');
  app.set('view engine', 'ejs');
  //viewディレクトリの指定
  app.set('views', path.resolve(__dirname, '../views'));
  app.use('/getRes', getRes);

  // 設定情報をグローバル変数へセットする
  globalThis.config = config;

  log.info('[startServer]設定値 = ');
  log.info(globalThis.config);

  app.get('/', (req, res, next) => {
    res.render('server', config);
    req.connection.end();
  });
  //静的コンテンツはpublicディレクトリの中身を使用するという宣言
  app.use(express.static(path.resolve(__dirname, '../public')));

  // SEを取得する
  if (globalThis.config.playSe) {
    const list = await readWavFiles(globalThis.config.sePath);
    globalThis.electron.seList = list.map((file) => `${globalThis.config.sePath}/${file}`);
  }

  // Twitchに接続
  if (globalThis.config.twitchUser) {
    globalThis.electron.twitchChat = new ChatClient();
    globalThis.electron.twitchChat.connect();
    globalThis.electron.twitchChat.join(globalThis.config.twitchUser);
    globalThis.electron.twitchChat.on('PRIVMSG', (msg) => {
      const imgUrl = './img/twitch.png';
      let domStr = `<li class="list-item"><span class="icon-block"><img class="icon" src="${imgUrl}"></span><div class="content">`;
      if (globalThis.config.showName) {
        domStr += `<span class="name">${msg.displayName}</span>`;
      }
      domStr += `<span class="res">${msg.messageText}</span></div></li>`;
      if (globalThis.electron.socket) globalThis.electron.socket.send(domStr);
      if (config.playSe && globalThis.electron.seList.length > 0) {
        const wavfilepath = globalThis.electron.seList[Math.floor(Math.random() * globalThis.electron.seList.length)];
        globalThis.electron.mainWindow.webContents.send('play-sound', wavfilepath);
      }
    });
  }

  // WebSocketを立てる
  app.ws('/ws', (ws, req) => {
    globalThis.electron.socket = ws as any;
    ws.on('message', (message) => {
      console.log('Received: ' + message);
      if (message === 'ping') {
        ws.send('pong');
      }
    });

    ws.on('close', () => {
      console.log('I lost a client');
    });
  });

  //指定したポートで待ち受け開始
  server = app.listen(config.port, () => {
    log.info('[startServer]start server on port:' + config.port);
    log.info(server.listening);
  });
  //成功メッセージ返却
  event.returnValue = 'success';
});

/**
 * サーバー停止
 */
ipcMain.on('stop-server', function (event: any) {
  log.info(server.listening);
  log.info('[startServer]server stop');
  log.info(server.listening);
  server.close();
  app = null;
  event.returnValue = 'stop';

  globalThis.electron.twitchChat.close();
});

import fs from 'fs';
const readWavFiles = (path: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) reject(err);
      const fileList = files.filter((file) => {
        return isExistFile(path + '/' + file) && /.*\.wav$/.test(file); //絞り込み
      });
      resolve(fileList);
    });
  });
};

const isExistFile = (file: string) => {
  try {
    fs.statSync(file).isFile();
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') return false;
  }
};
