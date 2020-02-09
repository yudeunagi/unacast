/**
* ロード時初期設定
* ・スレッドURL取得
* ・レス番号取得
* ・レス番号がない場合最新1件を、ある場合指定した番号からのレスを全取得
* ・オプションによる表示設定を行った後
*/
window.onload = function(){
  console.log('read');
  //URLの設定
  var url = $('#threadUrl').val();
  //レス番号の設定
  var resNum = $('#resNumber').val();

  if(resNum.length < 1) {
    //レス番号がない場合は最新の1件を取得する
    getLastNumber(url);
  }else{
    //レス番号があるばあい指定したレスからすべて取得
    readThread(url);
  }

  //表示オプションによる設定
  setOption();

  // リロードインターバル指定(ms)
  const interval = 1000 * parseInt($('#interval').val());
  //指定した秒数ごとにレス取得関数を呼び出す
  setInterval(dispUpdate, interval);
}

/**
* オプションによる表示設定変更
* 原則ロード時の1回のみ呼び出される
*/
function setOption(){
  // 新着下表示オプションがONの場合ul要素に.bottomを付与する
  if($('#dispSort').val() == 1){
    $('#res-list').addClass('dispBottom');
  }

  // 自動改行オプションによってクラスを付与する
  if($('#wordBreak').val() == 1){
    $('#res-list').addClass('brakeOn');
  }else{
    $('#res-list').addClass('brakeOff');
  }
}

/**
* 一定時間ごとに行われる画面更新処理
* レスが1001に行っていた場合、次スレ取得
* そうでなければ新着レス取得処理を行う
*/
function dispUpdate(url){
  var resNum = $('#resNumber').val();
  var url = $('#threadUrl').val();

  if(resNum > 1000){
    getNextThread(url);
  }else{
    readThread(url);
  }
}

// 最終レス番取得API
function getLastNumber(url){
  // ポート番号の取得
  var port = $('#port').val();
  //リクエストボディの作成
  const data = makeRequestBody(url);
  const requestUrl = 'http://localhost:' + port + '/getRes';
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
      return res.json();
    }
  })
  .then((resJson) => {
    //レスがなければ終了
    if(resJson.length < 1)
    {
      console.log('新着なし');
      return;
    }
    //レス番号更新
    $('#resNumber').val(parseInt(resJson[0].resNumber) + 1);
  })
  .catch((error) => {
    //エラー処理
    console.log(error);
  });
}

/**指定したスレを読みに行くメソッド
*url:掲示板のURL
*resNum:最終レス番号
*/
var readThread = function(url){
  // ポート番号の取得
  var port = $('#port').val();
  //リクエストボディの作成
  const data = makeRequestBody(url);
  // 内部で作成したレス取得APIを呼び出す
  const requestUrl = 'http://localhost:' + port + '/getRes';
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
      console.log('ok');
      return res.json();
    }
  })
  .then((resJson) => {
    //レスがなければ終了
    if(resJson.length < 1)
    {
      console.log('新着なし');
      return;
    }

    resJson.forEach(resObj =>{
      //レス番号更新
      $('#resNumber').val(parseInt(resObj.resNumber) + 1);
      //パースしたレスポンスをprependしていく
      prependItems(resObj.html);
    })

    /*
    一度に複数レスが来た時の扱いはどうする？
    アニメーションでレスを追加したい、アニメーションに時間かけすぎると次のレス取得が始まってしまう
    */

  })
  .catch((error) => {
    //エラー処理
    console.log(error);
  });

}

/**
* 次スレの取得をする
*/
var getNextThread = function(url){

  //デバッグ用ログ、あとでけす
  console.log('スレッドが1000いきましたどすえ');

  // ポート番号の取得
  var port = $('#port').val();
  //リクエストボディの作成
  const data = makeRequestBody(url);
  // 内部で作成したレス取得APIを呼び出す
  const requestUrl = 'http://localhost:' + port + '/getRes/nextThread/';
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
      console.log('ok');
      return res.json();
    }
  })
  .then((resJson) => {
    //レスがなければ終了
    console.log(resJson);
    //次スレ設定処理、スレッドのURL変更
    $('#threadUrl').val(resJson.nextUrl);

    //
    var startResNum = $('#newThreadStartResNumber').val();
    //レス番号を1に更新
    $('#resNumber').val(startResNum);
    //スレタイ更新
    $('#threadTitle').val(resJson.threadTitle);

    //新スレ移動メッセージ
    var html = nextThreadMessage(resJson.threadTitle);
    prependItems(html);

  })
  .catch((error) => {
    //エラー処理
    console.log(error);
  });
}


//レスをリスト追加
function prependItems(html){

    // 表示順オプションで上に追加するか下に追加するか選ぶ
    if($('#dispSort').val() == 1){
      $('#res-list').append(html);
    }
    else{
      $('#res-list').prepend(html);
    }
}

/** リクエスト作成
*
*/
function makeRequestBody(url, num){
  var data = {
    "threadUrl": url,
    "resNumber": $('#resNumber').val()
  };
  return data;
}

//リストにアイテム追加＊ダミーメソッド。もうつかわん
function nextThreadMessage(title){
  var $li = $('<li />', {class: 'list-item'});
  var $icon = $('<span />', {class: 'icon-block'}).append(''); // ここにアイコン
  var $content = $('<div />', {class: 'content'});
  var $name = $('<span />', {class: 'name'}).append('次スレに移動します');
  var $res = $('<span />', {class: 'res'}).append(title);
  $li.append($icon);
  $li.append($content);
  $content.append($name);
  $content.append('<br/>');
  $content.append($res);
  $('#res-list').prepend($li);
}
