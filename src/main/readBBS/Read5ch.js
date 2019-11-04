/**
* 5ch互換BBS読み込み用モジュール
*/
const request = require('request-promise'); //httpリクエスト
const iconv = require('iconv-lite'); // 文字コード変換用パッケージ
//ステータスコード304 _NotModified
const NOT_MODIFIED = '304';

// 最終取得スレッド
var lastThreadUrl = '';
// 最終レス番号
var lastResNumber = 0;
//最終更新日時
var lastModified = null;
// 最終バイト数
var lastByte = 0;

/**
* コンストラクタ
*
*/
var ReadSitaraba = function()
{
//  this.randomIconList =
}

/**
* レス読み込み
* 引数で指定した板からレスを読む
* レス番号を指定していない場合は最新1件取得
* @param String // threadUrl スレURL
* @param String // resNum レス番号
*/
ReadSitaraba.prototype.read = async function(threadUrl, resNum, res, next){


  //板や最終日レス番号がかわったら最初からとり直す(lastmodifiと rangeのリセット)
  if(threadUrl != lastThreadUrl
  || resNum < lastResNumber ){
    lastThreadUrl = threadUrl;
    lastModified = null;
    lastByte = 0;
  }else {
    console.log('noresete');
  }

  //リクエストURL作成 下記みたいな感じで変換する
  //https://bbs.jpnkn.com/test/read.cgi/yudeunagi/1572734724/
  //https://bbs.jpnkn.com/yudeunagi/dat/1572734724.dat
  //ちなみに https://bbs.jpnkn.com/yudeunagi/subject.txt で生きてるスレ一覧がとれる
  var rep = /\/test\/read.cgi(\/.+)(\/.+)\//;
  var requestUrl = threadUrl.replace(rep ,'$1\/dat$2\.dat' );

  /**
  １．レス番号指定がない場合
    最新1件
  ２．番号指定あり、且つ、初回取得の場合
    ２－１．レス500、指定505とか
      null返却
    ２－２．レス500、指定490とか
      490からそれ以降の分をあるだけ
  */

  var range = lastByte + '-';
  //リクエストオプションの設定
  var options = {
    url: requestUrl,
    method: 'GET',
    encoding: null, // ここでnull指定しないとなんかうまくいかない
    "resolveWithFullResponse": true,
    headers: {
      "if-modified-since": lastModified,
    }
  }
  console.log(options);

  var responseJson;
  //掲示板へのリクエスト実行
  console.log('[Read5ch.js]5ch系BBSレス取得API呼び出し開始');
  await request(options)
  .then(response =>{
    var statusCode = response.statusCode;
    console.log('[Read5ch.js]5ch系BBSレス取得API呼び出し完了、statusCode=' + statusCode);

    // 取得バイト数表示
    console.log('[Read5ch.read]レスポンスヘッダ=');
    var headers = response.headers;
    console.log(headers);
    //LastModifiedとRange更新処理
    if(headers['last-modified'] != null){
      lastModified = headers['last-modified'];
      console.log(lastModified);
    }
//    if(headers['content-length'] != null){
//      console.log(headers['content-length']);
//      lastByte = lastByte + parseInt(headers['content-length']);
//      console.log('range=' + lastByte);
//    }

    //gzipで取得出来たら解凍処理も入れる

    //したらばAPIの文字コードはEUC-JPなのでUTF-8に変換する
    var str = iconv.decode(Buffer.from(response.body), 'Shift_JIS');
    // レスポンスオブジェクト作成
    responseJson = purseNewResponse(str, resNum);

    // ヘッダからLast-Modified と content-length数をとる

  })
  .catch(error =>{
    console.log('[Read5ch.js]5ch系BBSレス取得APIリクエストエラー、message=' + error.message);
    var rsArray = new Array();
    console.log(rsArray.length);
    responseJson = rsArray;
  });
  return responseJson;
}

/**
*取得したレスポンス（複数）のパース
*戻りとしてパースしたjsonオブジェクトの配列を返す
* @param string // res 板から返却されたdat
* @param string // resNum リクエストされたレス番号
*/
function purseNewResponse(res ,resNum){
  //結果を格納する配列
  var result = new Array();
  // レス番号
  var num = 0;

  //新着レスを改行ごとにSplitする
  var resArray = res.split(/\r\n|\r|\n/);
  // 新着なしなら戻る。
  if(resArray.length == 0){
    return result;
  } else {
    // 配列の最後に空の要素が入ることがあるので取り除く
    if(resArray[resArray.length - 1].length == 0){
      resArray.pop();
    }
  }

  // レス指定なしの場合最後の1件取得
  if(resNum == null || resNum.length == 0 || resNum == 0){
    num = resArray.length - 1;
  } else {
    num = resNum - 1;
  }

  console.log('[Read5ch.purseNewResponse]取得レス番号=' + num);
  //1行ごとにパースする
  for(; num < resArray.length; num++){
      //パースメソッド呼び出し
    if(resArray[num].length > 0 ){
      result.push(purseResponse(resArray[num], num));
    }
  }
  // パースしたオブジェクトの配列を返却
  return result;
}

/**レスポンスのパース
*Jsonオブジェクトを返却する
*@param String // res レスポンス1レス
*@param Integer // num レス番（0スタート）
*{
* number: レス番号
* name: 名前
* email: メアド
* date: 日付
* text: 本文
* threadTitle: スレタイ
* id: ID
*}
*/
function purseResponse(res, num){

  //APIの返却値を<>で分割
  //レスの要素
  //0:名前
  //1:メアド
  //2:日付とID （2019/11/03(日) 08:55:00 ID:kanikani）みたいに表示
  //3:本文
  //4:スレタイ （1レス目のみ）
  var splitRes = res.split('<>');
  // 日付とID分離処理、' ID:'で区切る
  var dateId = splitRes[2].split(' ID:');
  var date = dateId[0];
  // IDが取得できない場合はnullにする
  var id = dateId.length == 2 ? dateId[1] : null;

  var resJson = {
    number: num + 1
    ,name: splitRes[0]
    ,email: splitRes[1]
    ,date: date
    ,text: splitRes[3]
    ,threadTitle: splitRes[4]
    ,id: id
  };

  // オブジェクトを返却
  return resJson;
}

module.exports = ReadSitaraba;
