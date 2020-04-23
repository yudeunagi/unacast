// Electronのモジュール
import path from 'path';
import electron from 'electron';
import log from 'electron-log';

console.trace = () => {
  //
};

process.on('uncaughtException', (err) => {
  log.error('electron:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
  // app.quit();
});
// アプリケーションをコントロールするモジュール
const app = electron.app;

app.allowRendererProcessReuse = true;

// サーバー起動モジュール
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ss = require('./startServer');
console.trace(ss);

// ウィンドウを作成するモジュール
const BrowserWindow = electron.BrowserWindow;

// メインウィンドウはGCされないようにグローバル宣言
globalThis.electron = {
  mainWindow: undefined as any,
  seList: [],
  twitchChat: undefined as any,
  youtubeChat: undefined as any,
  socket: null as any,
  threadConnectionError: 0,
};

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// Electronの初期化完了後に実行
app.on('ready', () => {
  // ウィンドウサイズを1280*720（フレームサイズを含まない）に設定する
  globalThis.electron.mainWindow = new BrowserWindow({
    width: 700,
    height: 720,
    useContentSize: true,
    icon: __dirname + './../../icon.png',
    webPreferences: {
      nodeIntegration: true,
    },
  });
  globalThis.electron.mainWindow.setTitle('unacast');
  globalThis.electron.mainWindow.setMenu(null);

  //使用するhtmlファイルを指定する
  globalThis.electron.mainWindow.loadURL(path.resolve(__dirname, '../src/html/index.html'));

  // ウィンドウが閉じられたらアプリも終了
  globalThis.electron.mainWindow.on('closed', () => {
    globalThis.electron.mainWindow = undefined as any;
  });

  // 開発者ツールを開く
  // globalThis.electron.mainWindow.webContents.openDevTools();
});

// 音声再生できるようにする
app.commandLine.appendSwitch('--autoplay-policy', 'no-user-gesture-required');
