"use strict";

//Electronのモジュール
const path = require('path');
const electron = require("electron");
const http = require('http');
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;

//アプリケーションをコントロールするモジュール
const app = electron.app;

var ss = require('./js/startServer.js');

//ウィンドウを作成するモジュール

// メインウィンドウはGCされないようにグローバル宣言
let mainWindow = null;

//全てのウィンドウが閉じたら終了
app.on("window-all-closed", () => {
  if (process.platform != "darwin") {
    app.quit();
  }
});

// Electronの初期化完了後に実行
app.on("ready", () => {
  //ウィンドウサイズを1280*720（フレームサイズを含まない）に設定する
  mainWindow = new BrowserWindow({width: 1280, height: 720, useContentSize: true});
  //使用するhtmlファイルを指定する
  mainWindow.loadURL(`file://${__dirname}/html/index.html`);

  // ウィンドウが閉じられたらアプリも終了
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

});

/*
ipcMain.on("start-server", () => {

  ss.startServer(http);
});

ipcMain.on("stop-server", function (event, arg) {
    server.stop();
    console.log("main : server stop");
    event.sender.send("stop");
});
*/
