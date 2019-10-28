
const ipcRenderer = require("electron").ipcRenderer;


document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Content Loaded");
  //formのsubmit時の動作を定義する
  document.getElementById("form-main").onsubmit = () => {
    console.log("submit");

    // サーバー開始メッセージを送信する
    ipcRenderer.sendSync('start-server', 3000);
    return false;

  }

});
