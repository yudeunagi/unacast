import electron from 'electron';
import log from 'electron-log';
import { electronEvent } from '../main/const';

const ipcRenderer = electron.ipcRenderer;

document.addEventListener('DOMContentLoaded', () => {
  console.debug('[renderer.js]DOM Content Loaded');
  //設定のロード
  loadConfigToLocalStrage();
  //停止確認ダイアログ
  const dialog = document.getElementById('close-dialog') as HTMLElement;

  //起動・停止ボタン
  const startButton = document.getElementById('button-server-start') as HTMLInputElement;
  const stopButton = document.getElementById('button-server-stop') as HTMLInputElement;
  const closeOkButton = document.getElementById('button-close-dialog-ok') as HTMLInputElement;
  const closeCancelButton = document.getElementById('button-close-dialog-cancel') as HTMLInputElement;

  //サーバーのON-OFFする
  startButton.onclick = () => {
    //サーバー起動
    //設定情報取得
    const config = buildConfigJson();
    console.log('[renderer.js]config=');
    console.log(config);
    //設定情報をローカルストレージへ保存
    saveConfigToLocalStrage(config);

    //URLとポートを指定していない場合はエラー
    if (config.url === null || config.url.length < 1 || config.port === null || (config.port as any).length < 1) {
      return;
    }

    // サーバー開始メッセージを送信する
    const result = ipcRenderer.sendSync('start-server', config);
    console.debug(`[renderer.js] ${result}`);
    // サーバー起動・停止ボタン状態変更
    stopButton.disabled = false;
    startButton.disabled = true;
    return;
  };
  //サーバー停止ボタン
  stopButton.onclick = () => {
    const config = buildConfigJson();
    //設定情報をローカルストレージへ保存
    saveConfigToLocalStrage(config);

    //確認ダイアログを表示
    (dialog as any).showModal();
  };

  closeOkButton.onclick = () => {
    const result = ipcRenderer.sendSync('stop-server');
    console.debug('[renderer.js]' + result);
    //ダイアログクローズ
    (dialog as any).close();
    // サーバー起動・停止ボタン状態変更
    startButton.disabled = false;
    stopButton.disabled = true;
    return;
  };
  closeCancelButton.onclick = () => {
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
  const bouyomiVolume = parseInt((document.getElementById('bouyomi-volume') as HTMLInputElement).value);
  const notifyThreadConnectionErrorLimit = parseInt((document.getElementById('text-notify-threadConnectionErrorLimit') as HTMLInputElement).value);
  const notifyThreadResLimit = parseInt((document.getElementById('text-notify-threadResLimit') as HTMLInputElement).value);

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
  document.getElementsByName('typeYomiko').forEach((v) => {
    const elem = v as HTMLInputElement;
    if (elem.checked) typeYomiko = elem.value as typeof globalThis['config']['typeYomiko'];
  });

  // コメント処理
  let commentProcessType: typeof globalThis['config']['commentProcessType'] = 0;
  document.getElementsByName('commentProcessType').forEach((v) => {
    const elem = v as HTMLInputElement;
    if (elem.checked) commentProcessType = Number(elem.value) as typeof globalThis['config']['commentProcessType'];
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
    bouyomiVolume,
    notifyThreadConnectionErrorLimit,
    notifyThreadResLimit,
    commentProcessType,
  };

  return config;
};

/**
 * 設定をローカルストレージへ保存する
 * サーバー起動時に呼び出される
 **/
const saveConfigToLocalStrage = (config: typeof globalThis['config']) => {
  localStorage.setItem('config', JSON.stringify(config));
  console.debug('[renderer.js]config saved');
};

/**
 * ローカルストレージから設定をロードする
 */
const loadConfigToLocalStrage = () => {
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
    bouyomiVolume: 50,
    notifyThreadConnectionErrorLimit: 0,
    notifyThreadResLimit: 0,
    commentProcessType: 0,
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

  switch (config.commentProcessType) {
    case 0:
    case 1:
      (document.getElementById(`commentProcessType_${config.commentProcessType}`) as any).checked = true;
      break;
  }

  (document.getElementById('text-tamiyasu-path') as any).value = config.tamiyasuPath;
  (document.getElementById('text-bouyomi-port') as any).value = config.bouyomiPort;
  (document.getElementById('disp-bouyomi-volume') as any).innerHTML = config.bouyomiVolume;
  (document.getElementById('bouyomi-volume') as any).value = config.bouyomiVolume;
  (document.getElementById('text-notify-threadConnectionErrorLimit') as any).value = config.notifyThreadConnectionErrorLimit;
  (document.getElementById('text-notify-threadResLimit') as any).value = config.notifyThreadResLimit;

  console.debug('[renderer.js]config loaded');
};

//サーバー起動返信
ipcRenderer.on(electronEvent['start-server-reply'], (event: any, arg: any) => {
  console.debug(arg);
});

// 着信音再生
const audioElem = new Audio();
ipcRenderer.on(electronEvent['play-sound-start'], (event: any, wavfilepath) => {
  try {
    audioElem.src = wavfilepath;
    audioElem.play();
    audioElem.onended = () => {
      ipcRenderer.send(electronEvent['play-sound-end']);
    };
    audioElem.onerror = () => {
      ipcRenderer.send(electronEvent['play-sound-end']);
    };
  } catch (e) {
    log.error(e);
    ipcRenderer.send(electronEvent['play-sound-end']);
  }
});

ipcRenderer.on(electronEvent['wait-yomiko-time'], async (event: any, arg: string) => {
  await yomikoTime(arg);
  ipcRenderer.send(electronEvent['speaking-end']);
});
/** 音声合成が終わってそうな頃にreturn返す */
const yomikoTime = async (msg: string) => {
  return new Promise((resolve) => {
    const uttr = new globalThis.SpeechSynthesisUtterance(msg);
    uttr.volume = 0;
    uttr.onend = (event) => {
      resolve();
    };
    speechSynthesis.speak(uttr);
  });
};
