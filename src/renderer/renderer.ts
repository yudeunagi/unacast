import electron from 'electron';
import log from 'electron-log';

const ipcRenderer = electron.ipcRenderer;

document.addEventListener('DOMContentLoaded', () => {
  console.debug('[renderer.js]DOM Content Loaded');
  //設定のロード
  loadConfigToLocalStrage();
  //停止確認ダイアログ
  const dialog = document.getElementById('close-dialog') as HTMLElement;

  //起動・停止ボタン
  var startButton = document.getElementById('button-server-start') as HTMLInputElement;
  var stopButton = document.getElementById('button-server-stop') as HTMLInputElement;
  var closeOkButton = document.getElementById('button-close-dialog-ok') as HTMLInputElement;
  var closeCancelButton = document.getElementById('button-close-dialog-cancel') as HTMLInputElement;

  //サーバーのON-OFFする
  startButton.onclick = (event) => {
    //サーバー起動
    //設定情報取得
    var config = buildConfigJson();
    console.log('[renderer.js]config=');
    console.log(config);
    //設定情報をローカルストレージへ保存
    saveConfigToLocalStrage(config);

    //URLとポートを指定していない場合はエラー
    if (config.url === null || config.url.length < 1 || config.port === null || (config.port as any).length < 1) {
      return;
    }

    // サーバー開始メッセージを送信する
    var result = ipcRenderer.sendSync('start-server', config);
    console.debug('[renderer.js]' + result);
    // サーバー起動・停止ボタン状態変更
    stopButton.disabled = false;
    startButton.disabled = true;
    return;
  };
  //サーバー停止ボタン
  stopButton.onclick = (event) => {
    var config = buildConfigJson();
    //設定情報をローカルストレージへ保存
    saveConfigToLocalStrage(config);

    //確認ダイアログを表示
    (dialog as any).showModal();
  };

  closeOkButton.onclick = (event) => {
    var result = ipcRenderer.sendSync('stop-server');
    console.debug('[renderer.js]' + result);
    //ダイアログクローズ
    (dialog as any).close();
    // サーバー起動・停止ボタン状態変更
    startButton.disabled = false;
    stopButton.disabled = true;
    return;
  };
  closeCancelButton.onclick = (event) => {
    //ダイアログクローズ
    (dialog as any).close();
    return;
  };
});

//サーバー起動用のパラメータを作成する
const buildConfigJson = () => {
  //画面から各種項目を取得する
  const url = (document.getElementById('text-url') as HTMLInputElement).value;
  const resNumber = (document.getElementById('text-res-number') as HTMLInputElement).value;
  const initMessage = (document.getElementById('text-init-message') as HTMLInputElement).value;
  const port = parseInt((document.getElementById('text-port-number') as HTMLInputElement).value);
  // const dispNumber = parseInt((document.getElementById('text-disp-number') as HTMLInputElement).value);
  const dispNumber = NaN;
  const interval = parseInt((document.getElementById('rangeSpan') as HTMLInputElement).value);
  const youtubeUrl = (document.getElementById('text-youtube-id') as HTMLInputElement).value;
  const twitchUrl = (document.getElementById('text-twitch-id') as HTMLInputElement).value;
  const sePath = (document.getElementById('text-se-path') as HTMLInputElement).value;
  const tamiyasuPath = (document.getElementById('text-tamiyasu-path') as HTMLInputElement).value;
  const bouyomiPort = parseInt((document.getElementById('text-bouyomi-port') as HTMLInputElement).value);
  const notifyThreadConnectionErrorLimit = parseInt((document.getElementById('text-notify-threadConnectionErrorLimit') as HTMLInputElement).value);

  //レス番表示設定
  const showNumber = (document.getElementById('checkbox-showNumber') as HTMLInputElement).checked === true;
  //名前表示設定
  const showName = (document.getElementById('checkbox-showName') as any).checked === true;
  //時刻表示設定
  const showTime = (document.getElementById('checkbox-showTime') as any).checked === true;
  //自動改行設定
  const wordBreak = (document.getElementById('checkbox-wordBreak') as any).checked === true;
  //表示順序設定
  const dispSort = (document.getElementById('newResUp') as any).checked === false;
  //本文改行設定
  const newLine = (document.getElementById('enableNewLine') as any).checked === true;
  //本文改行設定
  const playSe = (document.getElementById('checkbox-playSe') as any).checked === true;

  let typeYomiko: typeof globalThis['config']['typeYomiko'] = 'none';
  document.getElementsByName('typeYomiko').forEach((v, i: number) => {
    const elem = v as HTMLInputElement;
    if (elem.checked) typeYomiko = elem.value as typeof globalThis['config']['typeYomiko'];
  });

  const config: typeof globalThis['config'] = {
    url: url,
    resNumber,
    initMessage,
    port,
    dispNumber,
    interval,
    youtubeId: youtubeUrl,
    twitchId: twitchUrl,
    dispSort,
    newLine,
    showNumber,
    showName,
    showTime,
    wordBreak,
    sePath,
    playSe,
    typeYomiko,
    tamiyasuPath,
    bouyomiPort,
    notifyThreadConnectionErrorLimit,
  };

  return config;
};

/**
 * 設定をローカルストレージへ保存する
 * サーバー起動時に呼び出される
 **/
function saveConfigToLocalStrage(config: typeof globalThis['config']) {
  localStorage.setItem('config', JSON.stringify(config));
  console.debug('[renderer.js]config saved');
}

/**
 * ローカルストレージから設定をロードする
 */
function loadConfigToLocalStrage() {
  const initConfig: typeof globalThis['config'] = {
    url: '',
    resNumber: '',
    initMessage: 'スレッド読み込みを開始しました',
    port: 3000,
    interval: 10,
    dispNumber: NaN,
    youtubeId: '',
    twitchId: '',
    dispSort: false,
    newLine: true,
    showNumber: true,
    showName: false,
    showTime: false,
    wordBreak: true,
    sePath: '',
    playSe: false,
    typeYomiko: 'none',
    tamiyasuPath: '',
    bouyomiPort: 50001,
    notifyThreadConnectionErrorLimit: 0,
  };

  const storageStr = localStorage.getItem('config');
  const storageJson: typeof globalThis['config'] = storageStr ? JSON.parse(storageStr) : {};

  globalThis.config = {
    ...initConfig,
    ...storageJson,
  };

  // 表示に反映する

  // レス番表示初期化
  (document.getElementById('checkbox-showNumber') as any).checked = config.showNumber;
  // 名前表示初期化
  (document.getElementById('checkbox-showName') as any).checked = config.showName;
  // 時刻表示初期化
  (document.getElementById('checkbox-showTime') as any).checked = config.showTime;
  // 自動改行初期化
  (document.getElementById('checkbox-wordBreak') as any).checked = config.wordBreak;
  // レス表示順ラジオ初期化
  if (config.dispSort) {
    (document.getElementById('newResDown') as any).checked = true;
  } else {
    (document.getElementById('newResUp') as any).checked = true;
  }

  // 改行設定初期化
  if (config.newLine) {
    (document.getElementById('enableNewLine') as any).checked = true;
  } else {
    (document.getElementById('disableNewLine') as any).checked = true;
  }

  (document.getElementById('text-port-number') as any).value = config.port;
  (document.getElementById('spanDisp') as any).innerHTML = config.interval;
  (document.getElementById('rangeSpan') as any).value = config.interval;
  (document.getElementById('text-init-message') as any).value = config.initMessage;
  (document.getElementById('text-url') as any).value = config.url;
  (document.getElementById('text-res-number') as any).value = config.resNumber.toString();
  // (document.getElementById('text-disp-number') as any).value = !config.dispNumber || Number.isNaN(config.dispNumber) ? '' : config.dispNumber.toString();
  (document.getElementById('text-youtube-id') as any).value = config.youtubeId;
  (document.getElementById('text-twitch-id') as any).value = config.twitchId;
  (document.getElementById('text-se-path') as any).value = config.sePath;
  (document.getElementById('checkbox-playSe') as any).checked = config.playSe;

  // 読み子の種類
  switch (config.typeYomiko) {
    case 'none':
      (document.getElementById('yomiko_none') as any).checked = true;
      break;
    case 'tamiyasu':
      (document.getElementById('yomiko_tamiyasu') as any).checked = true;
      break;
    case 'bouyomi':
      (document.getElementById('yomiko_bouyomi') as any).checked = true;
      break;
  }
  (document.getElementById('text-tamiyasu-path') as any).value = config.tamiyasuPath;
  (document.getElementById('text-bouyomi-port') as any).value = config.bouyomiPort;
  (document.getElementById('text-notify-threadConnectionErrorLimit') as any).value = config.notifyThreadConnectionErrorLimit;

  console.debug('[renderer.js]config loaded');
}

//サーバー起動返信
ipcRenderer.on('start-server-reply', (event: any, arg: any) => {
  console.debug(arg);
});

// 着信音再生
const audioElem = new Audio();
ipcRenderer.on('play-sound', async (event: any, arg: { wavfilepath: string; text: string }) => {
  console.log(`[renderer][play-sound]${JSON.stringify(arg)}`);
  try {
    audioElem.src = arg.wavfilepath;
    audioElem.play();
  } catch (e) {
    log.error(e);
  }
  audioElem.onended = () => {
    ipcRenderer.send('play-tamiyasu', arg.text);
  };
});
