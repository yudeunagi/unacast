
window.onload = function(){

  //URLの設定
  var url = $('#threadUrl').val();
  //URLの「read.cgi」を「rawmode.cgi」に変換
  var cgiurl = url.replace('read.cgi','rawmode.cgi');

  //レス番号の設定
  var resNum = $('#resNumber').val();
  //レス番号がない場合は最新の1件を取得する
  if(resNum.length < 1) {
    getLastNumber(cgiurl);
  }

  // リロードインターバル指定
  const interval = parseInt($('#interval').val());

  //指定した秒数ごとにレス取得関数を呼び出す
  setInterval(readThread, interval, cgiurl);
  //setInterval("appendItem()", 2000);
}

// リクエスト作成
function makeRequestBody(url, num){
  var data = {
    "threadUrl": url,
    "resNumber": $('#resNumber').val()
  };
  return data;
}

//指定したスレを読みに行くメソッド
//url:掲示板のURL
//resNum:最終レス番号
var readThread = function(url){
  //最終レス番号以降のすべてのレスを取得する

  //リクエストボディの作成
  const data = makeRequestBody(url);
  // console.log(data);

  // 内部で作成したレス取得APIを呼び出す
  const requestUrl = 'http://localhost:3000/getRes';
  //fetchでレスを取得する
  fetch(requestUrl, {
    method: 'POST',
    encoding: null,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  })
  .then(function(res) {
    if(res.ok) {
      //ステータスOKならレスポンスをテキストにセットして返す
      return res.text();
    }
  })
  .then((text) => {
    //レスがなければ終了
    if(text.length < 1)
    {
      return;
    }

    //成功時レスポンスをパースする
    var listItems = purseNewResponse(text);

    //パースしたレスポンスをprependしていく
    prependItems(listItems);

    /*
    一度に複数レスが来た時の扱いはどうする？
    for文でパースした<li>を1つづつprependしていく？
    アニメーションでレスを追加したい、アニメーションに時間かけすぎると次のレス取得が始まってしまう
    */

  })
  .catch((error) => {
    //エラー処理
    console.log(error);
  });

}


// 最終レス番取得API
function getLastNumber(url){
  //リクエストボディの作成
  const data = makeRequestBody(url);

  var requestUrl = 'http://localhost:3000/getRes/lastNumber';
  //fetchでレスを取得する
  fetch(requestUrl, {
    method: 'POST',
    encoding: null,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  })
  .then(function(res) {
    if(res.ok) {
      //ステータスOKならレスポンスをテキストにセットして返す
      return res.text();
    }
  })
  .then((text) => {
    //レスがなければ終了
    if(text.length < 1)
    {
      console.log('最新レス取得に失敗');
      return;
    }

    //レス番号取得
    var splitRes = text.split('<>');
    //レス番号更新
    $('#resNumber').val(parseInt(splitRes[0]) + 1);
    /*
    一度に複数レスが来た時の扱いはどうする？
    for文でパースした<li>を1つづつprependしていく？
    アニメーションでレスを追加したい、アニメーションに時間かけすぎると次のレス取得が始まってしまう
    */
  })
  .catch((error) => {
    //エラー処理
    console.log(error);
  });
}


//取得したレスポンス（複数）のパース
//戻りとしてパースした<li>の配列を返す
function purseNewResponse(res){
  //結果を格納する配列
  var result = new Array();

  //新着レスを改行ごとにSplitする
  var resArray = res.split(/\r\n|\r|\n/);
  //1行ごとにパースする
  resArray.forEach(function(value){
    //パースメソッド呼び出し
    if(value.length > 0 ){
      result.push(purseResponse(value));
    }
  });
  // パースした<li>オブジェクトの配列を返却
  return result;
}

//レスポンスのパース
//Jqueryオブジェクトを返却する
function purseResponse(res){

  //APIの返却値を<>で分割
  //レスの要素
  //0:レス番号
  //1:名前
  //2:メアド
  //3:日付
  //4:本文
  //5:スレタイ
  //6:ID
  var splitRes = res.split('<>');

  var $li = $('<li />');
  var iconImg = getIcon(splitRes[1],splitRes[6]); //アイコン取得
  var $icon = $('<span />', {class: 'icon'}).append(iconImg); // ここにアイコン
  //名無しならばレス番号を表示する
  var defaultName = '名無しさん'; //ここはフロントの設定から取得するようにする
  var nm = new String(splitRes[1]);
  var name = nm.replace(defaultName, splitRes[0]);
  var $name = $('<span />', {class: 'name'}).append(name);

  var $res = $('<span />', {class: 'res'}).append(splitRes[4]);
  $li.append($icon);
  $li.append($name);
  $li.append('：');
  $li.append($res);

  //レス番号更新
  $('#resNumber').val(parseInt(splitRes[0]) + 1);

  // <li> オブジェクトを返却
  return $li;
}

//アイコン画像取得、名前やIDを見て条件によって固定のアイコンを返す
function getIcon(name, id){

  var imgTag = '<img src="img/icon1.png" />';
  //TODO あとでつくる
  return '';
//  return imgTag;
}

//レスをリスト追加
function prependItems(listItems){
  listItems.forEach(function(item){
    $('#res-list').prepend(item);
  });
}

//リストにアイテム追加
function appendItem(){
  var $li = $('<li />');
  var $icon = $('<span />', {class: 'icon'}).append(''); // ここにアイコン
  var $name = $('<span />', {class: 'name'}).append('ななし');
  var $res = $('<span />', {class: 'res'}).append('これはテストです');
  $li.append($icon);
  $li.append($name);
  $li.append('：');
  $li.append($res);
  $('#res-list').prepend($li);
}
