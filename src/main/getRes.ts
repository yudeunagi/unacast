import express from 'express';
import bodyParser from 'body-parser'; // jsonパーサ
const router = express.Router();
import log from 'electron-log';

import ReadIcons from './ReadIcons'; //アイコンファイル名取得
const readIcons = new ReadIcons();

import { sendDom, createDom } from './startServer';
import ReadSitaraba, { ShitarabaResponse } from './readBBS/readSitaraba'; // したらば読み込み用モジュール
import Read5ch from './readBBS/Read5ch'; // 5ch互換板読み込み用モジュール
import { electronEvent } from './const';
const sitaraba = new ReadSitaraba();
const read5ch = new Read5ch();
// 掲示板読み込みモジュール、一度決定したら使いまわすためにグローバル宣言
let bbsModule: ReadSitaraba | ReadSitaraba = null as any;

// リクエストのbodyをパース下りエンコードしたりするためのやつ
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/**
 * http://localhost:3000/getRes にGETメソッドのリクエストを投げると、
 * JSON形式で文字列を返す。
 */
router.post('/', async (req, res, next) => {
  // リクエストからURLとレス番号を取得する
  const threadUrl = req.body.threadUrl;
  // レス番号取得
  const resNum = req.body.resNumber;

  // リクエストURLを解析し、使用するモジュールを変更する（初回のみ）
  if (bbsModule === null) {
    bbsModule = analysBBSName(threadUrl) as any;
  }

  // 選択したモジュールでレス取得処理を行う
  bbsModule
    .read(threadUrl, resNum)
    .then(async (response) => {
      console.log('[getRes.js] fetch res success = ' + response.length);
      globalThis.electron.threadConnectionError = 0;

      // 返却されたjsonオブジェクトを組み立てる
      const result = buildResponseArray(response);
      console.log('[getRes.js] fetch res end');

      // レス着信音
      if (result.length > 0 && config.playSe && globalThis.electron.seList.length > 0) {
        const wavfilepath = globalThis.electron.seList[Math.floor(Math.random() * globalThis.electron.seList.length)];
        globalThis.electron.mainWindow.webContents.send(electronEvent['play-sound'], { wavfilepath, text: response[response.length - 1].text });
      }

      // 返却
      res.header('Content-Type', 'application/json; charset=UTF-8');
      res.send(result);
    })
    .catch((err) => {
      if (globalThis.config.notifyThreadConnectionErrorLimit > 0) {
        globalThis.electron.threadConnectionError += 1;
        if (globalThis.electron.threadConnectionError >= globalThis.config.notifyThreadConnectionErrorLimit) {
          globalThis.electron.threadConnectionError = 0;
          const icon = `./img/unacast.png`;
          sendDom({
            name: 'unacastより',
            text: '掲示板が規定回数通信エラーになりました。設定を見直すか、掲示板URLを変更してください。',
            imgUrl: icon,
          });
        }
      }
      log.error(err);
    });

  return;
});

/*
 * URLをみてどこのBBSか判定して使用するモジュールを返却する
 */
const analysBBSName = (threadUrl: string) => {
  // したらばドメイン名
  const sitarabaDomain = 'jbbs.shitaraba.net';
  // こんな感じで必要に応じて増やしていけばいいんじゃね？
  // const dokkanoBBS = 'dokka.bbs.com';

  if (threadUrl.indexOf(sitarabaDomain) !== -1) {
    // URLにしたらばドメイン名が入ってればしたらば
    return sitaraba;
  }
  // どこにも該当しなかったらとりあえず5chで
  // この辺も対応ドメインリストとか作ってちゃんと判定したほうがよさそう
  return read5ch;
};

/**
 * レスポンスの生成
 * レスポンスオブジェクトの配列をHTMLに変換
 */
const buildResponseArray = (resObject: ShitarabaResponse[]) => {
  //結果を格納する配列
  const result: ReturnType<typeof buildResponse>[] = [];
  resObject.forEach((value) => {
    result.push(buildResponse(value));
  });
  return result;
};

/**
 * レスポンスのパース
 * レス番号とHTML文字列を格納したオブジェクトを返却する
 * @param object // レスオブジェクト（ReadShitaraba.jsとか参照）
 * @return レス番 , HTML整形後のレスのオブジェクト
 */
const buildResponse = (res: ShitarabaResponse) => {
  res.imgUrl = readIcons.getRandomIcons();
  const dom = createDom(res);

  // レス番とテキストをセットにしたJSONを返す
  const result: {
    resNumber: string;
    html: string;
  } = {
    resNumber: res.number?.toString(),
    html: dom,
  };

  // JSONオブジェクトを返却
  return result;
};

export default router;
