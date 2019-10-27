var express = require('express');
var router = express.Router();
var request = require('request'); //httpリクエスト
var iconv = require('iconv-lite'); // 文字コード変換用パッケージ

/* サンプルAPI
 * http://localhost:3000/getRes にGETメソッドのリクエストを投げると、
 * JSON形式で文字列を返す。
 */
router.get('/', function(req, res, next) {

  //でコード処理
  var sup = iconv.encodingExists('EUC-JP');
  console.log('support EUC-JP =' + sup);


  // URLやレス番号はリクエストとして受け取る
  var requestUrl = 'http://jbbs.shitaraba.net/bbs/rawmode.cgi/radio/31003/1564068767/510-';

  //リクエストオプションの設定
  var options = {
    url: requestUrl,
    method: 'GET',
    encoding: null // ここでnull指定しないとなんかうまくいかない
  }

  request(options, function (error, response, body) {
      //エンコードをEUC-JPと指定して返却
      var str = iconv.decode(Buffer.from(body), 'EUC-JP');
      res.header('Content-Type', 'text/plain; charset=UTF-8')
      res.send(str);
  })

  //失敗時エラーレスポンスを返す
  /*
  var param = 'response';
  res.header('Content-Type', 'text/plain; charset=utf-8')
  res.send(param);
  */
});

/* サンプルAPI②
 * http://localhost:3000/getRes/hello にGETメソッドのリクエストを投げると、
 * JSON形式で文字列を返す。
 */
router.get('/getRess', function(req, res, next) {
  var param = {"result":"Hello World !"};
  res.header('Content-Type', 'application/json; charset=utf-8')
  res.send(param);
});

module.exports = router;
