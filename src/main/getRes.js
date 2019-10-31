var express = require('express');
var router = express.Router();
//var request = require('request'); //httpリクエスト
//var iconv = require('iconv-lite'); // 文字コード変換用パッケージ
var bodyParser = require('body-parser');// jsonパーサ


const { JSDOM } = require('jsdom');
const $ = require('jquery')(new JSDOM().window);

var ReadSitaraba = require('./readBBS/readSitaraba') //　したらば読み込み用モジュール
var sitaraba = new ReadSitaraba();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/* サンプルAPI
 * http://localhost:3000/getRes にGETメソッドのリクエストを投げると、
 * JSON形式で文字列を返す。
 */
router.post('/', async function(req, res, next) {

  // リクエストからURLとレス番号を取得する
  var threadUrl = req.body.threadUrl;
  // レス番号取得
  var resNum = req.body.resNumber;

  //***リクエストURLを解析し、使用するモジュールを変更する
  // 現在はしたらば掲示板のみ対応

  //したらば
  var bbsModule = sitaraba;


  //***ここまでモジュール判定処理



  //選択したモジュールでレス取得処理を行う
  bbsModule.read(threadUrl, resNum)
  .then(response =>{

    console.log('[getRes.js]レス取得成功。処理開始');

    // 返却されたjsonオブジェクトを組み立てる
    var result = buildResponse(response);

    // 返却
    res.header('Content-Type', 'application/json; charset=UTF-8')
    console.log('[getRes.js]レス処理完了');
//    console.log(result);
    res.send(result);

  })
  .catch(err =>{
    console.log(err);
  });


  return;
  //こっから下は移植したらけす
  //失敗時エラーレスポンスを返す
  /*
  var param = 'response';
  res.header('Content-Type', 'text/plain; charset=utf-8')
  res.send(param);
  */
});

function buildResponse(resObject){
  //結果を格納する配列
  var result = new Array();

  resObject.forEach((value) =>{
    result.push(build(value));
  });
  return result;
}
//レスポンスのパース
//Jqueryオブジェクトを返却する
function build(res){

  console.log('[getRes.js]パース開始');
  //最終的にHTML文字列にするためのダミーオブジェクト
  var $dummy = $('<div />');

  var $li = $('<li />', {class: 'list-item'});
  var $iconImg = getIcon(res.name,res.id); //アイコン取得
  var $icon = $('<span />', {class: 'icon-block'}).append($iconImg); // ここにアイコン

  //名無しならばレス番号を表示する
  var defaultName = global.config.noname; //ここはフロントの設定から取得するようにする
  var nm = new String(res.name);
  var name = nm.replace(defaultName, res.number);
  var $name = $('<span />', {class: 'name'}).append(name);
  var $res = $('<span />', {class: 'res'}).append(res.text);

  var $resDiv = $('<div />', {class: 'content'});
  $resDiv.append($name).append('　').append($res);

  $li.append($icon);
  $li.append($resDiv);

  //HTMLオブジェクトをダミー要素へ入れる
  $dummy.append($li);

  //レス番号更新
  //$('#resNumber').val(parseInt(res.number) + 1);

  console.log('[getRes.js]パース完了');
  console.log($dummy.html());

  // レス番とテキストをセットにしたJSONを返す
  var result = {
     resNumber : res.number
    ,html : $dummy.html()
  }

  // JSONオブジェクトを返却
  return result;
}

//アイコン画像取得、名前やIDを見て条件によって固定のアイコンを返す
function getIcon(name, id){

//  var $imgTag = '<img class="icoo" src="./img/random/sanma_1.png"/>';
  // ここはアイコンフォルダからランダムで取得するようにしたい
  var src = './img/random/'
  src = src + 'teriko.png'
  var $imgTag = $('<img />', {class: 'icon', src: src});

  return $imgTag;
}
module.exports = router;
