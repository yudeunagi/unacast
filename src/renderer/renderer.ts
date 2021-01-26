import electron from 'electron';
import log from 'electron-log';
import { electronEvent } from '../main/const';
import { sleep } from '../main/util';

const ipcRenderer = electron.ipcRenderer;

document.addEventListener('DOMContentLoaded', () => {
  console.debug('[renderer.js]DOM Content Loaded');
  // 設定のロード
  loadConfigToLocalStrage();

  // 設定適用ボタン
  const applyButton = document.getElementById('button-config-apply') as HTMLInputElement;
  applyButton.onclick = () => {
    const config = buildConfigJson();
    console.log('[renderer.js]config=');
    console.log(config);
    //設定情報をローカルストレージへ保存
    saveConfigToLocalStrage(config);

    ipcRenderer.send(electronEvent.APPLY_CONFIG, config);
  };

  // 起動・停止ボタン
  const startButton = document.getElementById('button-server-start') as HTMLInputElement;
  startButton.onclick = () => {
    // いじっちゃいけない設定を非活性に
    toggleInputFormDisable(true);

    //設定情報取得
    const config = buildConfigJson();
    console.log('[renderer.js]config=');
    console.log(config);
    //設定情報をローカルストレージへ保存
    saveConfigToLocalStrage(config);

    // ポートを指定していない場合はエラー
    if (config.port === null || (config.port as any).length < 1) {
      return;
    }

    // URL表示
    const serverUrl = `http://localhost:${config.port}`;
    (document.getElementById('server-full-url') as HTMLInputElement).insertAdjacentHTML(
      'afterbegin',
      `<div style="cursor:pointer;color:blue;" onClick="urlopen('${serverUrl}')">${serverUrl}</div>`,
    );
    (document.getElementById('port-number-area') as HTMLInputElement).style.display = 'none';

    // サーバー開始メッセージを送信する
    const result = ipcRenderer.sendSync('start-server', config);
    console.debug(`[renderer.js] ${result}`);
    // サーバー起動・停止ボタン状態変更
    stopButton.disabled = false;
    startButton.disabled = true;
    return;
  };

  //サーバー停止ボタン
  const stopButton = document.getElementById('button-server-stop') as HTMLInputElement;
  stopButton.onclick = () => {
    //確認ダイアログを表示
    (dialog as any).showModal();
  };

  // 確認ダイアログのボタン
  const closeOkButton = document.getElementById('button-close-dialog-ok') as HTMLInputElement;
  const closeCancelButton = document.getElementById('button-close-dialog-cancel') as HTMLInputElement;
  // 停止確認ダイアログ
  const dialog = document.getElementById('close-dialog') as HTMLElement;

  // サーバー停止確認ダイアログ
  closeOkButton.onclick = () => {
    const result = ipcRenderer.sendSync('stop-server');
    console.debug('[renderer.js]' + result);
    //ダイアログクローズ
    (dialog as any).close();

    (document.getElementById('server-full-url') as HTMLInputElement).innerHTML = '';
    (document.getElementById('port-number-area') as HTMLInputElement).style.display = 'block';

    toggleInputFormDisable(false);
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

  // アラートダイアログのボタン
  const alertOkButton = document.getElementById('button-alert-dialog-ok') as HTMLInputElement;
  // 停止確認ダイアログ
  const alertDialog = document.getElementById('alert-dialog') as HTMLElement;
  alertOkButton.onclick = () => {
    //ダイアログクローズ
    (alertDialog as any).close();
    return;
  };
});

/**
 * サーバ起動中にいじっちゃいけない設定の活性状態を切り替える
 * @param isDisabled 非活性ならtrue
 */
const toggleInputFormDisable = (isDisabled: boolean) => {
  (document.getElementById('text-port-number') as HTMLInputElement).disabled = isDisabled;
  (document.getElementById('text-youtube-id') as HTMLInputElement).disabled = isDisabled;
  (document.getElementById('text-youtube-liveid') as HTMLInputElement).disabled = isDisabled;
  (document.getElementById('text-twitch-id') as HTMLInputElement).disabled = isDisabled;
  (document.getElementById('text-niconico-id') as HTMLInputElement).disabled = isDisabled;
  (document.getElementById('text-jpnknFast-id') as HTMLInputElement).disabled = isDisabled;

  document.getElementsByName('dispSort').forEach((v, i) => {
    (v as HTMLInputElement).disabled = isDisabled;
    (v.parentNode as HTMLElement).style.backgroundColor = isDisabled ? 'lightgray' : '';
  });
  document.getElementsByName('dispType').forEach((v, i) => {
    (v as HTMLInputElement).disabled = isDisabled;
    (v.parentNode as HTMLElement).style.backgroundColor = isDisabled ? 'lightgray' : '';
  });

  (document.getElementById('checkbox-wordBreak') as any).disabled = isDisabled;
  (document.getElementById('checkbox-wordBreak') as any).parentNode.style.backgroundColor = isDisabled ? 'lightgray' : '';
};

/**
 * 設定RenderのHTMLから、Configを取得する
 */
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
  const youtubeLiveId = (document.getElementById('text-youtube-liveid') as HTMLInputElement).value;
  const twitchUrl = (document.getElementById('text-twitch-id') as HTMLInputElement).value;
  const niconicoUrl = (document.getElementById('text-niconico-id') as HTMLInputElement).value;
  const jpnknFastBoardId = (document.getElementById('text-jpnknFast-id') as HTMLInputElement).value;
  const sePath = (document.getElementById('text-se-path') as HTMLInputElement).value;
  const tamiyasuPath = (document.getElementById('text-tamiyasu-path') as HTMLInputElement).value;
  const bouyomiPort = parseInt((document.getElementById('text-bouyomi-port') as HTMLInputElement).value);
  const bouyomiVolume = parseInt((document.getElementById('bouyomi-volume') as HTMLInputElement).value);
  const yomikoReplaceNewline = (document.getElementById('yomiko-replace-newline') as any).checked === true;

  const notifyThreadConnectionErrorLimit = parseInt((document.getElementById('text-notify-threadConnectionErrorLimit') as HTMLInputElement).value);
  const notifyThreadResLimit = parseInt((document.getElementById('text-notify-threadResLimit') as HTMLInputElement).value);
  // 自動レス移動
  const moveThread = (document.getElementById('moveThread') as any).checked === true;

  // アイコン表示設定
  const showIcon = (document.getElementById('checkbox-showIcon') as HTMLInputElement).checked === true;
  // レス番表示設定
  const showNumber = (document.getElementById('checkbox-showNumber') as HTMLInputElement).checked === true;
  // 名前表示設定
  const showName = (document.getElementById('checkbox-showName') as any).checked === true;
  // 時刻表示設定
  const showTime = (document.getElementById('checkbox-showTime') as any).checked === true;
  // 自動改行設定
  const wordBreak = (document.getElementById('checkbox-wordBreak') as any).checked === true;
  // 表示順序設定
  const dispSort = (document.getElementById('newResUp') as any).checked === false;
  // 本文改行設定
  const newLine = (document.getElementById('enableNewLine') as any).checked === true;
  // SEパス
  const playSe = (document.getElementById('checkbox-playSe') as any).checked === true;
  const playSeVolume = parseInt((document.getElementById('playSe-volume') as HTMLInputElement).value);

  let thumbnail: typeof globalThis['config']['thumbnail'] = 0;
  document.getElementsByName('thumbnail').forEach((v) => {
    const elem = v as HTMLInputElement;
    if (elem.checked) thumbnail = Number(elem.value) as typeof globalThis['config']['thumbnail'];
  });

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

  let dispType: typeof globalThis['config']['dispType'] = 0;
  document.getElementsByName('dispType').forEach((v) => {
    const elem = v as HTMLInputElement;
    if (elem.checked) dispType = Number(elem.value) as typeof globalThis['config']['dispType'];
  });

  const config: typeof globalThis['config'] = {
    url: url,
    resNumber,
    initMessage,
    port,
    dispNumber,
    interval,
    youtubeId: youtubeUrl,
    youtubeLiveId: youtubeLiveId,
    twitchId: twitchUrl,
    niconicoId: niconicoUrl,
    jpnknFastBoardId,
    dispSort,
    newLine,
    showIcon,
    showNumber,
    showName,
    showTime,
    wordBreak,
    thumbnail,
    sePath,
    playSe,
    playSeVolume,
    typeYomiko,
    tamiyasuPath,
    bouyomiPort,
    bouyomiVolume,
    yomikoReplaceNewline,
    notifyThreadConnectionErrorLimit,
    notifyThreadResLimit,
    moveThread,
    commentProcessType,
    dispType,
  };

  return config;
};

/**
 * 設定をローカルストレージへ保存する
 * サーバー起動時に呼び出される
 */
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
    youtubeLiveId: '',
    twitchId: '',
    niconicoId: '',
    jpnknFastBoardId: '',
    dispSort: false,
    newLine: true,
    showIcon: true,
    showNumber: true,
    showName: false,
    showTime: false,
    wordBreak: true,
    thumbnail: 0,
    sePath: '',
    playSeVolume: 100,
    playSe: false,
    typeYomiko: 'none',
    tamiyasuPath: '',
    bouyomiPort: 50001,
    bouyomiVolume: 50,
    yomikoReplaceNewline: false,
    notifyThreadConnectionErrorLimit: 0,
    notifyThreadResLimit: 0,
    moveThread: true,
    commentProcessType: 0,
    dispType: 0,
  };

  const storageStr = localStorage.getItem('config');
  const storageJson: typeof globalThis['config'] = storageStr ? JSON.parse(storageStr) : {};

  globalThis.config = {
    ...initConfig,
    ...storageJson,
  };

  // 表示に反映する
  // アイコン表示初期化
  (document.getElementById('checkbox-showIcon') as any).checked = config.showIcon;
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
  (document.getElementById('text-youtube-liveid') as any).value = config.youtubeLiveId;
  (document.getElementById('text-twitch-id') as any).value = config.twitchId;
  (document.getElementById('text-niconico-id') as any).value = config.niconicoId;
  (document.getElementById('text-jpnknFast-id') as any).value = config.jpnknFastBoardId;
  // レス着信音
  (document.getElementById('text-se-path') as any).value = config.sePath;
  (document.getElementById('checkbox-playSe') as any).checked = config.playSe;
  (document.getElementById('disp-playSe-volume') as any).innerHTML = config.playSeVolume;
  (document.getElementById('playSe-volume') as any).value = config.playSeVolume;

  // サムネイル表示
  (document.getElementById(`thumbnail_${config.thumbnail}`) as any).checked = true;

  (document.getElementById('yomiko-replace-newline') as any).checked == config.yomikoReplaceNewline;

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

  switch (config.dispType) {
    case 0:
    case 1:
      (document.getElementById(`dispType_${config.dispType}`) as any).checked = true;
      break;
  }

  (document.getElementById('text-tamiyasu-path') as any).value = config.tamiyasuPath;
  (document.getElementById('text-bouyomi-port') as any).value = config.bouyomiPort;
  (document.getElementById('disp-bouyomi-volume') as any).innerHTML = config.bouyomiVolume;
  (document.getElementById('bouyomi-volume') as any).value = config.bouyomiVolume;
  (document.getElementById('text-notify-threadConnectionErrorLimit') as any).value = config.notifyThreadConnectionErrorLimit;
  (document.getElementById('text-notify-threadResLimit') as any).value = config.notifyThreadResLimit;
  (document.getElementById('moveThread') as any).checked == config.moveThread;

  console.debug('[renderer.js]config loaded');
};

// サーバー起動返信
ipcRenderer.on(electronEvent.START_SERVER_REPLY, (event: any, arg: any) => {
  console.debug(arg);
});

// 着信音再生
const audioElem = new Audio();
ipcRenderer.on(electronEvent.PLAY_SOUND_START, (event: any, arg: { wavfilepath: string; volume: number }) => {
  try {
    audioElem.volume = arg.volume / 100;
    audioElem.src = arg.wavfilepath;
    audioElem.play();
    audioElem.onended = () => {
      ipcRenderer.send(electronEvent.PLAY_SOUND_END);
    };
    audioElem.onerror = () => {
      ipcRenderer.send(electronEvent.PLAY_SOUND_END);
    };
  } catch (e) {
    log.error(e);
    ipcRenderer.send(electronEvent.PLAY_SOUND_END);
  }
});

ipcRenderer.on(electronEvent.WAIT_YOMIKO_TIME, async (event: any, arg: string) => {
  await yomikoTime(arg);
  ipcRenderer.send(electronEvent.SPEAKING_END);
});

/**
 * 音声合成が終わってそうな頃にreturn返す
 * @param 読み込む文章
 */
const yomikoTime = async (msg: string) => {
  return new Promise<void>((resolve) => {
    const uttr = new globalThis.SpeechSynthesisUtterance(msg);
    uttr.volume = 0;
    uttr.onend = (event) => {
      resolve();
    };
    speechSynthesis.speak(uttr);

    // 10秒経ったら強制的に終わらせる
    sleep(10 * 1000).then(() => {
      resolve();
    });
  });
};

// 何かしら通知したいことがあったら表示する
ipcRenderer.on(electronEvent.SHOW_ALERT, async (event: any, args: string) => {
  // 停止確認ダイアログ
  ((document.getElementById('alert-dialog') as HTMLElement).getElementsByClassName('mdl-dialog__content')[0] as HTMLElement).innerText = args;

  const alertDialog = document.getElementById('alert-dialog') as HTMLElement;
  (alertDialog as any).showModal();
});

// 何かしら通知したいことがあったら表示する
ipcRenderer.on(electronEvent.UPDATE_STATUS, async (event: any, args: { commentType: 'bbs' | 'jpnkn' | 'youtube' | 'twitch' | 'niconico'; category: string; message: string }) => {
  console.log(`[UPDATE_STATUS]`);
  switch (args.commentType) {
    case 'bbs': {
      if (args.category === 'title') {
        (document.getElementById('bbs-title') as HTMLElement).innerText = args.message;
      } else if (args.category === 'status') {
        (document.getElementById('bbs-connection-status') as HTMLElement).innerText = args.message;
      }
      break;
    }
    case 'jpnkn': {
      if (args.category === 'status') {
        (document.getElementById('jpnknFast-connection-status') as HTMLElement).innerText = args.message;
      }
      break;
    }
    case 'youtube': {
      if (args.category === 'status') {
        (document.getElementById('youtube-connection-status') as HTMLElement).innerText = args.message;
      } else {
        (document.getElementById('youtube-live-id') as HTMLElement).innerText = args.message;
      }
      break;
    }
    case 'twitch': {
      (document.getElementById('twitch-connection-status') as HTMLElement).innerText = args.message;
      break;
    }
    case 'niconico': {
      if (args.category === 'status') {
        (document.getElementById('niconico-connection-status') as HTMLElement).innerText = args.message;
      }
      break;
    }
  }
});

// config保存
ipcRenderer.on(electronEvent.SAVE_CONFIG, async (event: any, arg: typeof globalThis.config) => {
  saveConfigToLocalStrage(arg);
});
