var express = require('express');
var router = express.Router();
var request = require('request'); //httpリクエスト
var iconv = require('iconv-lite'); // 文字コード変換用パッケージ
var bodyParser = require('body-parser');// jsonパーサ

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/* サンプルAPI
 * http://localhost:3000/getRes にGETメソッドのリクエストを投げると、
 * JSON形式で文字列を返す。
 */
router.post('/', function(req, res, next) {

  //デコード可能か確認＊確認できたのでコメントアウト
  //var sup = iconv.encodingExists('EUC-JP');
  //console.log('support EUC-JP =' + sup);
  //console.log(req.body);

  // リクエストからURLとレス番号を取得する
  var threadUrl = req.body.threadUrl;
  // レス番号取得
  var resNum = req.body.resNumber;
  //リクエストURL作成
  var requestUrl = threadUrl + resNum + '-';

  //リクエストオプションの設定
  var options = {
    url: requestUrl,
    method: 'GET',
    encoding: null // ここでnull指定しないとなんかうまくいかない
  }

  //掲示板へのリクエスト実行
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
router.post('/lastNumber', function(req, res, next) {

    // リクエストからURLとレス番号を取得する
    var threadUrl = req.body.threadUrl;
    //リクエストURL作成
    var requestUrl = threadUrl + 'l1';

    //リクエストオプションの設定
    var options = {
      url: requestUrl,
      method: 'GET',
      encoding: null // ここでnull指定しないとなんかうまくいかない
    }

    //掲示板へのリクエスト実行
    request(options, function (error, response, body) {
        //エンコードをEUC-JPと指定して返却
        var str = iconv.decode(Buffer.from(body), 'EUC-JP');
        res.header('Content-Type', 'text/plain; charset=UTF-8')
        res.send(str);
    });

    //失敗時エラーレスポンスを返す
    /*
    var param = 'response';
    res.header('Content-Type', 'text/plain; charset=utf-8')
    res.send(param);
    */
});

module.exports = router;
