const http = require('http');
const fs = require('fs');
var express = require('express');
var app;

const { ipcMain } = require('electron');
// レス取得APIをセット
var getRes = require('./getRes.js');

// サーバーをグローバル変数にセットできるようにする（サーバー停止処理のため）
var server;

/* サーバー起動
* config:設定を格納したjson、以下jsonの中身
* url:掲示板URL
* resNumber:読み込み開始レス位置
* port:ポート番号
*
*
*/
ipcMain.on("start-server", (event, config) => {
  express = require('express');
  app = express();
  app.set('view engine', 'ejs');
  app.use('/getRes', getRes);

  // 設定情報をグローバル変数へセットする
  global.config = config;

  console.log('[startServer]設定値 = ');
  console.log(global.config);

  app.get('/', function(req,res, next) {
    res.render("server", config);
    console.log(config);
    req.connection.end();
  });
  //静的コンテンツはpublicディレクトリの中身を使用するという宣言
  app.use(express.static('public'));

  //指定したポートで待ち受け開始
  server = app.listen(config.port, ()=>{
    console.log('[startServer]start server on port:' + config.port);
    console.log(server.listening);

  });
  //成功メッセージ返却
  event.returnValue = 'success';
});

/* サーバー停止
*
*/
ipcMain.on("stop-server", function (event) {
    console.log(server.listening);
    server.close();
    app = null;
    express = null;
    console.log("[startServer]server stop");
    console.log(server.listening);
    event.returnValue = 'stop';
});
