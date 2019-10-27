const http = require('http');
const fs = require('fs');
const express = require('express');
var app = express();

app.set('view engine', 'ejs');

// レス取得モジュール
var getRes = require('./getRes.js');
// APIをセット
app.use('/getRes', getRes);

exports.startServer = function(portNum){

  app.get('/', function(req,res, next) {
    res.render("server", {});
  });
  app.use(express.static('public'));
  app.listen(portNum);

/*
  var server = http.createServer(function(req,res) {
    //ファイル読み込み
    fs.readFile('./src/html/server.html', 'UTF-8',
    (error, data)=>{
      //エラー時の処理
      if(error){
        console.log('html read failed');
        throw error;
      }

      console.log('html read success');
      //ヘッダ設定
      res.writeHead(200, {'Content-Type':'text/html; charset=UTF-8'});
      //本文表示
      res.write(data);
      res.end();
    });
  });

  //待ち受け開始
  server.listen(portNum);
*/

  console.log('start server');
}
