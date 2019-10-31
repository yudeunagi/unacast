
const ipcRenderer = require("electron").ipcRenderer;


document.addEventListener("DOMContentLoaded", () => {
    console.log("[renderer.js]DOM Content Loaded");
  //formのsubmit時の動作を定義する
  document.getElementById("form-main").onsubmit = () => {
    console.log("[renderer.js]submit");

    //設定情報取得
    var config = buildConfigJson();
    console.log('[renderer.js]config=')
    console.log(config);

    // サーバー開始メッセージを送信する
    var result = ipcRenderer.sendSync('start-server', config);
    console.log('[renderer.js]' + result);
    return false;
  }
});

//サーバー起動用のパラメータを作成する
function buildConfigJson(){
  //画面から各種項目を取得する
  var url = document.getElementById("text-url").value;
  var resNumber = document.getElementById("text-res-number").value;
  var noname = document.getElementById("text-noname").value;
  var port = parseInt(document.getElementById("text-port-number").value);
  var dispNumber = document.getElementById("text-res-number").value;
  var interval = document.getElementById("rangeSpan").value;
  var youtubeUrl = document.getElementById("text-youtube-url").value;

  var config =
  {
    "url":url
    ,"resNumber":resNumber
    ,"noname":noname
    ,"port":port
    ,"dipsNumber":dispNumber
    ,"interval":interval
    ,"youtubeUrl":youtubeUrl
  }

  return config;
};

//サーバー起動返信
ipcRenderer.on('start-server-reply', (event, arg) =>{
  console.log(arg);
});
