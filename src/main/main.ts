// Electronのモジュール
import path from 'path';
import electron, { Tray, Menu, dialog } from 'electron';
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

// 多重起動防止
if (!app.requestSingleInstanceLock()) {
  log.error('It is terminated for multiple launches.');
  app.quit();
} else {
  app.allowRendererProcessReuse = true;

  const iconPath = path.resolve(__dirname, '../icon.png');

  // サーバー起動モジュール
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const ss = require('./startServer');
  console.trace(ss);

  // ウィンドウを作成するモジュール
  const BrowserWindow = electron.BrowserWindow;

  // メインウィンドウはGCされないようにグローバル宣言
  globalThis.electron = {
    mainWindow: null as any,
    chatWindow: null as any,
    seList: [],
    twitchChat: null as any,
    youtubeChat: null as any,
    socket: null as any,
    threadConnectionError: 0,
    threadNumber: 0,
    commentQueueList: [],
  };

  // 全てのウィンドウが閉じたら終了
  // app.on('window-all-closed', () => {
  //   if (process.platform != 'darwin') {
  //     app.quit();
  //   }
  // });

  // Electronの初期化完了後に実行
  app.on('ready', () => {
    // ウィンドウサイズを（フレームサイズを含まない）設定
    globalThis.electron.mainWindow = new BrowserWindow({
      width: 700,
      height: 720,
      useContentSize: true,
      icon: iconPath,
      webPreferences: {
        nodeIntegration: true,
      },
      skipTaskbar: true,
    });
    globalThis.electron.mainWindow.setTitle('unacast');
    globalThis.electron.mainWindow.setMenu(null);

    // レンダラーで使用するhtmlファイルを指定する
    globalThis.electron.mainWindow.loadURL(path.resolve(__dirname, '../src/html/index.html'));

    // ウィンドウが閉じられたらアプリも終了
    globalThis.electron.mainWindow.on('close', (event) => {
      event.preventDefault();
      dialog
        .showMessageBox(globalThis.electron.mainWindow, {
          type: 'question',
          buttons: ['Yes', 'No'],
          // title: '',
          message: '終了しますか？',
        })
        .then((value) => {
          if (value.response === 0) {
            app.exit();
          }
        });
    });
    globalThis.electron.mainWindow.on('closed', () => {
      log.info('window close');
      app.exit();
    });

    // 開発者ツールを開く
    // globalThis.electron.mainWindow.webContents.openDevTools();

    let tray = null;
    app.whenReady().then(() => {
      tray = new Tray(iconPath);
      const contextMenu = Menu.buildFromTemplate([
        {
          label: '設定',
          click: function () {
            globalThis.electron.mainWindow.focus();
          },
        },
        {
          label: 'コメント',
          click: function () {
            globalThis.electron.chatWindow.focus();
          },
        },
        {
          label: '終了',
          click: function () {
            globalThis.electron.mainWindow.close();
          },
        },
      ]);
      tray.setToolTip('∈(ﾟ◎ﾟ)∋ｳﾅｰ');
      tray.setContextMenu(contextMenu);
      tray.on('click', (event) => {
        globalThis.electron.mainWindow.focus();
      });
    });

    createChatWindow();
  });

  const createChatWindow = () => {
    const chatWindow = new BrowserWindow({
      width: 400,
      useContentSize: true,
      icon: iconPath,
      webPreferences: {
        nodeIntegration: true,
      },
      // タスクバーに表示しない
      skipTaskbar: true,
      // 閉じれなくする
      closable: false,
    });
    chatWindow.setTitle('unacast');
    chatWindow.setMenu(null);

    // レンダラーで使用するhtmlファイルを指定する
    chatWindow.loadURL(path.resolve(__dirname, '../src/html/chat.html'));

    globalThis.electron.chatWindow = chatWindow;
    // chatWindow.webContents.openDevTools();
  };

  // 音声再生できるようにする
  app.commandLine.appendSwitch('--autoplay-policy', 'no-user-gesture-required');
}
