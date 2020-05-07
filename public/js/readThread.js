/** 表示順。trueなら新着が下 */
let dispSort = false;
/** 横幅超過時の折返し */
let wordBreak = false;
/**
 * 表示タイプ
 * - 0: チャット
 * - 1: SpeechCast
 */
let dispType = 0;
/** ポート番号 */
const port = window.location.port;
const hostname = window.location.origin;
let initMessage = '';
window.onload = async () => {
  const config = await fetchServerConfig();
  if (!config) {
    await sleep(500);
    window.location.reload();
  }
  dispSort = config.dispSort;
  wordBreak = config.wordBreak;
  dispType = config.dispType;
  initMessage = config.initMessage;
  resetCommentView(initMessage);

  // クラスの付与
  // 新着下表示オプションがONの場合、ul要素に.bottomを付与する
  if (dispSort) {
    $('#res-list').addClass('dispBottom');
  }
  // 自動改行オプションによってクラスを付与する
  if (wordBreak) {
    $('#res-list').addClass('brakeOn');
  } else {
    $('#res-list').addClass('brakeOff');
  }

  checkServerConfig();
  readThread();
  checkWsConnect();

  // WebSocket接続
  setInterval(checkWsConnect, 5 * 1000);

  // サーバー再起動されてたらリロードする
  setInterval(checkServerConfig, 3 * 1000);
};

/** @type WebSocket */
let socket;
/** @type number */
let pingWsIntervalTimer;

/** WebSocketの接続 */
const checkWsConnect = () => {
  if (socket) return;
  try {
    const url = `ws://localhost:${port}/ws`;
    console.log(`WS 接続開始: ${url}`);

    socket = new WebSocket(url);
    socket.addEventListener('open', (e) => {
      console.log('Socket 接続成功');
      // 定期的にpingを打つ
      pingWsIntervalTimer = setInterval(pingWs, 2 * 1000);
    });
    socket.addEventListener('message', (e) => {
      console.debug('[message received]');
      if (e.data === 'pong') {
        console.debug(e.data);
        pingReturn = true;
      } else {
        console.debug(e);
        const json = JSON.parse(e.data);
        switch (json.type) {
          case 'add': {
            addCommentItems(json.message);
            break;
          }
          case 'reset': {
            resetCommentView(json.message);
            break;
          }
        }
      }
    });
    socket.addEventListener('error', (e) => {
      console.error(`[checkWsConnect] WebSocket接続エラー`);
      console.error(e);
      socket = null;
    });
  } catch (e) {
    console.error(`[checkWsConnect] その他エラー`);
    console.error(e);
    socket = null;
  }
};

/**
 * WebSocket疎通確認用変数
 * @description ping投げる前にfalseにしておき、返ってきたらtrueにする
 */
let pingReturn = false;

/** WebSocket疎通確認 */
const pingWs = async () => {
  console.debug('[ws] ping打ち');
  pingReturn = false;
  try {
    socket.send('ping');
    await sleep(3000);
    if (!pingReturn) {
      throw new Error('ping timeout');
    }
  } catch (e) {
    console.log('[ws] 通信が返ってこないので打ち切り');
    if (socket) socket.close();
    socket = null;
    clearInterval(pingWsIntervalTimer);
  }
};

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

/**
 * スレの初期一覧を読み込む
 */
const readThread = () => {
  // 内部で作成したレス取得APIを呼び出す
  const requestUrl = `${hostname}/getRes`;
  //fetchでレスを取得する
  fetch(requestUrl, {
    method: 'GET',
    encoding: null,
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (res.ok && res.status === 200) {
        //ステータスOKならレスポンスをテキストにセットして返す
        console.log('ok');
        return res.json();
      } else {
        throw new Error(`[readThread] 通信エラー url = ${requestUrl}`);
      }
    })
    .then((resJson) => {
      //レスがなければ終了
      if (resJson.length < 1) {
        console.log('新着なし');
        return;
      }

      if (dispType === 0) {
        resJson.forEach(async (resObj) => {
          await addCommentItems(resObj);
        });
      }
    })
    .catch((error) => {
      //エラー処理
      console.log(error);
    });
};

/**
 * サーバーの設定をチェックする
 */
const checkServerConfig = async () => {
  const config = await fetchServerConfig();
  if (!config) return;
  if (config.dispSort !== dispSort || config.wordBreak !== wordBreak || config.dispType !== dispType) window.location.reload();
};

const fetchServerConfig = async () => {
  const requestUrl = `${hostname}/config`;
  try {
    const res = await fetch(requestUrl, {
      method: 'GET',
      encoding: null,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok || res.status !== 200) throw new Error(`[readThread] 通信エラー url = ${requestUrl}`);
    return await res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * レスをリスト追加
 * @param {string} html
 */
const addCommentItems = async (html) => {
  switch (dispType) {
    case 0: {
      // 表示順オプションで上に追加するか下に追加するか選ぶ
      if (dispSort) {
        $('#res-list').append(html);
      } else {
        $('#res-list').prepend(html);
      }
      break;
    }
    case 1: {
      // 初期メッセージを非表示にする
      $('#initMessage').hide();
      $('#res-list').append(html);
      break;
    }
    default: {
    }
  }
};

/**
 * 初期状態に戻す
 * @param {string} message
 */
const resetCommentView = (message) => {
  $('.list-item').remove();
  $('#initMessage > .name').text(message);
  $('#initMessage').show();
};
