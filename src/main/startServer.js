const http = require('http');
const fs = require('fs');
const express = require('express');
var app = express();

const { ipcMain } = require('electron');


app.set('view engine', 'ejs');

// レス取得APIをセット
var getRes = require('./getRes.js');
app.use('/getRes', getRes);


/* サーバー起動
* config:設定を格納したjson、以下jsonの中身
* url:掲示板URL
* resNumber:読み込み開始レス位置
* port:ポート番号
*
*
*/
ipcMain.on("start-server", (event, config) => {
  app.get('/', function(req,res, next) {
    res.render("server", config);
  });
  //静的コンテンツはpublicディレクトリの中身を使用するという宣言
  app.use(express.static('public'));

  //指定したポートで待ち受け開始
  app.listen(config.port, ()=>{
    console.log('start server on port:' + config.port);
  });
  //成功メッセージ返却
  event.returnValue = 'success';
});

/* サーバー停止
*
*/
ipcMain.on("stop-server", function (event, arg) {
    server.stop();
    console.log("main : server stop");
    event.sender.send("stop");
});
