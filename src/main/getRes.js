var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');// jsonパーサ

const ReadIcons = require('./ReadIcons'); //アイコンファイル名取得


const { JSDOM } = require('jsdom');
const $ = require('jquery')(new JSDOM().window);

var ReadSitaraba = require('./readBBS/readSitaraba') //　したらば読み込み用モジュール
var sitaraba = new ReadSitaraba();
var Read5ch = require('./readBBS/Read5ch') //　5ch互換板読み込み用モジュール
var read5ch = new Read5ch();
// 掲示板読み込みモジュール、一度決定したら使いまわすためにグローバル宣言
var bbsModule = null;

// リクエストのbodyをパース下りエンコードしたりするためのやつ
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/*
 * http://localhost:3000/getRes にGETメソッドのリクエストを投げると、
 * JSON形式で文字列を返す。
 */
router.post('/', async function(req, res, next) {

  // リクエストからURLとレス番号を取得する
  var threadUrl = req.body.threadUrl;
  // レス番号取得
  var resNum = req.body.resNumber;

  //リクエストURLを解析し、使用するモジュールを変更する（初回のみ）
  if(bbsModule === null){
    bbsModule = analysBBSName(threadUrl);
  }

  //選択したモジュールでレス取得処理を行う
  bbsModule.read(threadUrl, resNum)
  .then(response =>{
    console.log('[getRes.js]レス取得成功。件数=' + response.length);
    // 返却されたjsonオブジェクトを組み立てる
    var result = buildResponseArray(response);
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

/*
 * URLをみてどこのBBSか判定して使用するモジュールを返却する
 */
function analysBBSName(threadUrl){
  //したらばドメイン名
  const sitarabaDomain = 'jbbs.shitaraba.net';
  //こんな感じで必要に応じて増やしていけばいいんじゃね？
//  const dokkanoBBS = 'dokka.bbs.com';

  if(threadUrl.indexOf(sitarabaDomain) != -1){
    // URLにしたらばドメイン名が入ってればしたらば
    return sitaraba;
  }
  // どこにも該当しなかったらとりあえず5chで
  // この辺も対応ドメインリストとか作ってちゃんと判定したほうがよさそう
  return read5ch;
}

/**
* レスポンスの生成
* レスポンスオブジェクトの配列をHTMLに変換
*/
function buildResponseArray(resObject){
  //結果を格納する配列
  var result = new Array();
  console.log('[getRes.buildResponseArray]レスポンス整形開始 件数=' + resObject.length);
  resObject.forEach((value) =>{
    result.push(buildResponse(value));
  });
  return result;
}
/**
*レスポンスのパース
*レス番号とHTML文字列を格納したオブジェクトを返却する
* @param object // レスオブジェクト（ReadShitaraba.jsとか参照）
* @return { レス番 , HTML整形後のレス }のオブジェクト
*/
function buildResponse(res){

//  console.log('[getRes.js]パース開始');
//  console.log(res);
  //最終的にHTML文字列にするためのダミーオブジェクト
  var $dummy = $('<div />');

  var $li = $('<li />', {class: 'list-item'});
  var $iconImg = getIcon(res.name,res.id); //アイコン取得
  var $icon = $('<span />', {class: 'icon-block'}).append($iconImg); // ここにアイコン

  //レス番を取得
  var $resNumber = $('<span />', {class: 'resNumber'}).append(res.number);
  //名前を取得
  var $name = $('<span />', {class: 'name'}).append(res.name);
  //日付を取得
  var $date = $('<span />', {class: 'date'}).append(res.date);
  //レスを取得
  var $res = $('<span />', {class: 'res'}).append(res.text);

  // 名前やレスのエリア
  var $resDiv = $('<div />', {class: 'content'});

  //レス番表示
  if(global.config.showNumber == 1){
    $resDiv.append($resNumber);
  }
  //名前表示
  if(global.config.showName == 1){
    $resDiv.append($name);
  }
  //時刻表示
  if(global.config.showTime == 1){
    $resDiv.append($date);
  }

  //ここで改行化スペースを入れる
  if(global.config.newLine == 1){
    $resDiv.append('<br/>').append($res);
  }else{
    $resDiv.append($res);
  }

  $li.append($icon);
  $li.append($resDiv);

  //HTMLオブジェクトをダミー要素へ入れる
  $dummy.append($li);

  //レス番号更新
  //$('#resNumber').val(parseInt(res.number) + 1);

//  console.log('[getRes.js]パース完了');
//  console.log($dummy.html());

  // レス番とテキストをセットにしたJSONを返す
  var result = {
     resNumber : res.number
    ,html : $dummy.html()
  }

  // JSONオブジェクトを返却
  return result;
}

/**
* アイコン画像取得表示のためのimgタグを返す
* @param String // name 名前
* @param String // id ID、板によっては非表示だったりする、困る
*/
function getIcon(name, id){
  var src = getIconFileName(name, id);
  var $imgTag = $('<img />', {class: 'icon', src: src});
  return $imgTag;
}
/**
* アイコン画像名取得、名前やIDを見て条件によって固定のアイコンを返す
* @param String // name 名前
* @param String // id ID、板によっては非表示だったりする、困る
*/
function getIconFileName(name, id){
  // アイコンファイル名
  var src;

/* まだまだ未実装
  // コテハン機能
  if(コテハンオプション == true){
    src = ReadIcons.getKotehanIcons();
    if(src != null){
      // 名前に対応するアイコンが取得出来たらreturnする
      return src;
    }
  }
  // IDとアイコン関連付け機能
  if(IDオプション == true
    && id != null){
    src = ReadIcons.getIdIcons();
    if(src != null){
      return src;
    }
  }
  */
  // ランダムアイコン取得
  return ReadIcons.getRandomIcons();
}

module.exports = router;
