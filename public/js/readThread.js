let id = null;

window.onload = () => {
  readThread();

  // 新着下表示オプションがONの場合、ul要素に.bottomを付与する
  if ($('#dispSort').val() === 'true') {
    $('#res-list').addClass('dispBottom');
  }

  // 自動改行オプションによってクラスを付与する
  if ($('#wordBreak').val() === 'true') {
    $('#res-list').addClass('brakeOn');
  } else {
    $('#res-list').addClass('brakeOff');
  }

  // WebSocket接続
  setInterval(checkWsConnect, 3 * 1000);

  // サーバー再起動されてたらリロードする
  setInterval(checkId, 5 * 1000);
};

/** @type WebSocket */
let socket;

/** WebSocketの接続 */
const checkWsConnect = () => {
  if (socket) return;
  const port = $('#port').val();
  const url = 'ws://localhost:' + port + '/ws';
  console.log(`WS 接続開始: ${url}`);

  socket = new this.WebSocket(url);
  socket.addEventListener('open', function (e) {
    console.log('Socket 接続成功');
    // 定期的にpingを打つ
    setInterval(pingWs, 10 * 1000);
  });
  socket.addEventListener('message', (e) => {
    console.debug('[message received]');
    if (e.data === 'pong') {
      console.debug(e.data);
      pingReturn = true;
    } else {
      console.debug(e);
      prependItems(e.data);
    }
  });
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
  socket.send('ping');
  await sleep(5000);
  if (!pingReturn) {
    console.log('[ws] 通信が返ってこないので打ち切り');
    socket.close();
    socket = null;
  }
};

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

/**
 * スレの初期一覧を読み込む
 */
const readThread = () => {
  // ポート番号の取得
  const port = $('#port').val();
  // 内部で作成したレス取得APIを呼び出す
  const requestUrl = 'http://localhost:' + port + '/getRes';
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

      resJson.forEach((resObj) => {
        prependItems(resObj);
      });
    })
    .catch((error) => {
      //エラー処理
      console.log(error);
    });
};

/**
 * サーバーのバージョンをチェックする
 */
const checkId = async () => {
  const port = $('#port').val();
  const requestUrl = `http://localhost:${port}/id`;
  try {
    const res = await fetch(requestUrl, {
      method: 'GET',
      encoding: null,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok || res.status !== 200) throw new Error(`[readThread] 通信エラー url = ${requestUrl}`);
    const resText = await res.text();
    if (id) {
      // 再起動を検知したらリロード
      if (id !== resText) window.location.reload();
    } else {
      id = resText;
    }
  } catch (error) {
    console.log(error);
  }
};

//レスをリスト追加
const prependItems = (html) => {
  // 表示順オプションで上に追加するか下に追加するか選ぶ
  if ($('#dispSort').val() === 'true') {
    $('#res-list').append(html);
  } else {
    $('#res-list').prepend(html);
  }
};
