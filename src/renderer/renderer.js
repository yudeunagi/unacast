const ipcRenderer = require("electron").ipcRenderer;


document.addEventListener("DOMContentLoaded", () => {
  console.log("[renderer.js]DOM Content Loaded");
  //設定のロード
  loadConfigToLocalStrage();
  //停止確認ダイアログ
  var dialog = document.getElementById('close-dialog');
  //dialogエレメントに対応していないブラウザ用、なんだけどElectronはChromiumなんでいらない
  //if (! dialog.showModal) {
    //dialogPolyfill.registerDialog(dialog); //これ使うならdialogPolyfill.cssとjsが必要
  //}

  //起動・停止ボタン
  var startButton = document.getElementById('button-server-start');
  var stopButton = document.getElementById('button-server-stop');
  var closeOkButton = document.getElementById('button-close-dialog-ok');
  var closeCancelButton = document.getElementById('button-close-dialog-cancel');

  //サーバーのON-OFFする
  startButton.onclick = (event) => {
    //サーバー起動
    //設定情報取得
    var config = buildConfigJson();
    console.log('[renderer.js]config=')
    console.log(config);
    //設定情報をローカルストレージへ保存
    saveConfigToLocalStrage(config);

    //URLとポートを指定していない場合はエラー
    if((config.url === null || config.url.length < 1)
    || (config.port === null || config.port.length < 1))
    {
      return;
    }

    // サーバー開始メッセージを送信する
    var result = ipcRenderer.sendSync('start-server', config);
    console.log('[renderer.js]' + result);
    // サーバー起動・停止ボタン状態変更
    stopButton.disabled = false;
    startButton.disabled = true;
    return;
  }
  //サーバー停止ボタン
  stopButton.onclick = (event) => {
    var config = buildConfigJson();
    //設定情報をローカルストレージへ保存
    saveConfigToLocalStrage(config);

    //確認ダイアログを表示
    dialog.showModal();
  }

  closeOkButton.onclick = (event) => {
    var result = ipcRenderer.sendSync('stop-server');
    console.log('[renderer.js]' + result);
    //ダイアログクローズ
    dialog.close();
    // サーバー起動・停止ボタン状態変更
    startButton.disabled = false;
    stopButton.disabled = true;
    return;
  }
  closeCancelButton.onclick = (event) => {
    //ダイアログクローズ
    dialog.close();
    return;
  }

});

//サーバー起動用のパラメータを作成する
function buildConfigJson() {
  //画面から各種項目を取得する
  var url = document.getElementById("text-url").value;
  var resNumber = document.getElementById("text-res-number").value;
  var noname = document.getElementById("text-noname").value;
  var initMessage = document.getElementById("text-init-message").value;
  var port = parseInt(document.getElementById("text-port-number").value);
  var dispNumber = document.getElementById("text-disp-number").value;
  var interval = document.getElementById("rangeSpan").value;
  var youtubeUrl = document.getElementById("text-youtube-url").value;

  //レス番表示設定
  var showNumber = 0;
  if(document.getElementById("checkbox-showNumber").checked == true){
    showNumber = 1;
  }
  //名前表示設定
  var showName = 0;
  if(document.getElementById("checkbox-showName").checked == true){
    showName = 1;
  }
  //時刻表示設定
  var showTime = 0;
  if(document.getElementById("checkbox-showTime").checked == true){
    showTime = 1;
  }

  //自動改行設定
  var wordBreak = 0;
  if(document.getElementById("checkbox-wordBreak").checked == true){
    wordBreak = 1;
  }

  //表示順序設定
  var dispSort = 0;
  if(document.getElementById("newResUp").checked == true){
    dispSort = 0;
  }else{
    dispSort = 1;
  }

  //本文改行設定
  var newLine = 0;
  if(document.getElementById("disableNewLine").checked == true){
    newLine = 0;
  }else{
    newLine = 1;
  }

  var config = {
    "url": url,
    "resNumber": resNumber,
    "noname": noname,
    "initMessage": initMessage,
    "port": port,
    "dipsNumber": dispNumber,
    "interval": interval,
    "youtubeUrl": youtubeUrl,
    "dispSort": dispSort,
    "newLine": newLine,
    "showNumber": showNumber,
    "showName": showName,
    "showTime": showTime,
    "wordBreak": wordBreak

  }

  return config;
};

/**
* 設定をローカルストレージへ保存する
* サーバー起動時に呼び出される
**/
function saveConfigToLocalStrage(config){
  localStorage.setItem('url', config.url);
  localStorage.setItem('resNumber', config.resNumber);
  localStorage.setItem('noname', config.noname);
  localStorage.setItem('initMessage', config.initMessage);
  localStorage.setItem('port', config.port);
  localStorage.setItem('dipsNumber', config.dipsNumber);
  localStorage.setItem('interval', config.interval);
  localStorage.setItem('youtubeUrl', config.youtubeUrl);
  localStorage.setItem('dispSort', config.dispSort);
  localStorage.setItem('newLine', config.newLine);
  localStorage.setItem('showNumber', config.showNumber);
  localStorage.setItem('showName', config.showName);
  localStorage.setItem('showTime', config.showTime);
  localStorage.setItem('wordBreak', config.wordBreak);

  console.log('[renderer.js]config saved');
}

/**
* ローカルストレージから設定をロードする
*/
function loadConfigToLocalStrage(){
  //ポート初期化
  var port = localStorage.getItem('port');
  if (port === null || port === 'NaN' || port.length < 1){
    port = '3000';
  }
  //更新間隔初期化
  var interval = localStorage.getItem('interval');
  if (interval === null || interval.length < 1){
    interval = '10';
  }
  // 初期メッセージ初期化
  var initMessage = localStorage.getItem('initMessage');
  if (initMessage === null || initMessage.length < 1){
    initMessage = 'スレッド読み込みを開始しました';
  }

  // レス番表示初期化
  var showNumber = localStorage.getItem('showNumber');
  if (showNumber === null || showNumber.length < 1 || showNumber == 1){
    document.getElementById("checkbox-showNumber").checked = true;
  }else{
    document.getElementById("checkbox-showNumber").checked = false;
  }

  // 名前表示初期化
  var showName = localStorage.getItem('showName');
  if (showName === null || showName.length < 1 || showName == 0){
    document.getElementById("checkbox-showName").checked = false;
  }else{
    document.getElementById("checkbox-showName").checked = true;
  }

  // 時刻表示初期化
  var showTime = localStorage.getItem('showTime');
  if (showTime === null || showTime.length < 1 || showTime == 0){
    document.getElementById("checkbox-showTime").checked = false;
  }else{
    document.getElementById("checkbox-showTime").checked = true;
  }

  // 自動改行初期化
  var wordBreak = localStorage.getItem('wordBreak');
  if (wordBreak === null || wordBreak.length < 1 || wordBreak == 1){
    document.getElementById("checkbox-wordBreak").checked = true;
  }else{
    document.getElementById("checkbox-wordBreak").checked = false;
  }

  // レス表示順ラジオ初期化
  var dispSort = localStorage.getItem('dispSort');
  if (dispSort === null || dispSort.length < 1 || dispSort == 0){
    document.getElementById("newResUp").checked = true;
  }else{
    document.getElementById("newResDown").checked = true;
  }

  // 改行設定初期化
  var newLine = localStorage.getItem('newLine');
  if (newLine === null || newLine.length < 1 || newLine == 0){
    document.getElementById("disableNewLine").checked = true;
  }else{
    document.getElementById("enableNewLine").checked = true;
  }

  document.getElementById("text-port-number").value = port;
  document.getElementById("spanDisp").innerHTML = interval;
  document.getElementById("rangeSpan").value = interval;
  document.getElementById("text-init-message").value = initMessage

  document.getElementById("text-url").value = localStorage.getItem('url');
  document.getElementById("text-res-number").value = localStorage.getItem('resNumber');
  document.getElementById("text-noname").value = localStorage.getItem('noname');
  document.getElementById("text-disp-number").value = localStorage.getItem('dipsNumber');
  document.getElementById("text-youtube-url").value = localStorage.getItem('youtubeUrl');
  console.log('[renderer.js]config loaded');
}

//サーバー起動返信
ipcRenderer.on('start-server-reply', (event, arg) => {
  console.log(arg);
});
