import express from 'express';
import bodyParser from 'body-parser'; // jsonパーサ
const router = express.Router();
import log from 'electron-log';

import ReadIcons from './ReadIcons'; //アイコンファイル名取得
const readIcons = new ReadIcons();

const { JSDOM } = require('jsdom');
const $ = require('jquery')(new JSDOM().window);

import ReadSitaraba, { ShitarabaResponse } from './readBBS/readSitaraba'; // したらば読み込み用モジュール
const sitaraba = new ReadSitaraba();
import Read5ch from './readBBS/Read5ch'; // 5ch互換板読み込み用モジュール
const read5ch = new Read5ch();
// 掲示板読み込みモジュール、一度決定したら使いまわすためにグローバル宣言
let bbsModule: ReadSitaraba | ReadSitaraba = null as any;

// リクエストのbodyをパース下りエンコードしたりするためのやつ
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/*
 * http://localhost:3000/getRes にGETメソッドのリクエストを投げると、
 * JSON形式で文字列を返す。
 */
router.post('/', async (req, res, next) => {
  // リクエストからURLとレス番号を取得する
  var threadUrl = req.body.threadUrl;
  // レス番号取得
  var resNum = req.body.resNumber;

  //リクエストURLを解析し、使用するモジュールを変更する（初回のみ）
  if (bbsModule === null) {
    bbsModule = analysBBSName(threadUrl) as any;
  }

  //選択したモジュールでレス取得処理を行う
  bbsModule
    .read(threadUrl, resNum)
    .then(async (response) => {
      console.log('[getRes.js]レス取得成功。件数=' + response.length);
      // 返却されたjsonオブジェクトを組み立てる
      const result = buildResponseArray(response);
      // 返却
      res.header('Content-Type', 'application/json; charset=UTF-8');
      console.log('[getRes.js]レス処理完了');
      if (result.length > 0 && config.playSe && globalThis.electron.seList.length > 0) {
        const wavfilepath = globalThis.electron.seList[Math.floor(Math.random() * globalThis.electron.seList.length)];
        globalThis.electron.mainWindow.webContents.send('play-sound', wavfilepath);
      }
      res.send(result);
    })
    .catch((err) => {
      log.error(err);
    });

  return;
});

/*
 * URLをみてどこのBBSか判定して使用するモジュールを返却する
 */
const analysBBSName = (threadUrl: string) => {
  //したらばドメイン名
  const sitarabaDomain = 'jbbs.shitaraba.net';
  //こんな感じで必要に応じて増やしていけばいいんじゃね？
  //  const dokkanoBBS = 'dokka.bbs.com';

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
  var result: ReturnType<typeof buildResponse>[] = [];
  console.trace('[getRes.buildResponseArray]レスポンス整形開始 件数=' + resObject.length);
  resObject.forEach((value) => {
    result.push(buildResponse(value));
  });
  return result;
};
/**
 *レスポンスのパース
 *レス番号とHTML文字列を格納したオブジェクトを返却する
 * @param object // レスオブジェクト（ReadShitaraba.jsとか参照）
 * @return { レス番 , HTML整形後のレス }のオブジェクト
 */
function buildResponse(res: ShitarabaResponse) {
  console.trace('[getRes.js]パース開始');
  console.trace(res);
  //最終的にHTML文字列にするためのダミーオブジェクト
  var $dummy = $('<div />');

  var $li = $('<li />', { class: 'list-item' });
  var $iconImg = getIcon(res.name, res.id); //アイコン取得
  var $icon = $('<span />', { class: 'icon-block' }).append($iconImg); // ここにアイコン

  //レス番を取得
  var $resNumber = $('<span />', { class: 'resNumber' }).append(res.number);
  //名前を取得
  var $name = $('<span />', { class: 'name' }).append(res.name);
  //日付を取得
  var $date = $('<span />', { class: 'date' }).append(res.date);
  //レスを取得
  var $res = $('<span />', { class: 'res' }).append(res.text);

  // 名前やレスのエリア
  var $resDiv = $('<div />', { class: 'content' });

  //レス番表示
  if (globalThis.config.showNumber) {
    $resDiv.append($resNumber);
  }
  //名前表示
  if (globalThis.config.showName) {
    $resDiv.append($name);
  }
  //時刻表示
  if (globalThis.config.showTime) {
    $resDiv.append($date);
  }

  // 名前と本文を改行で分ける
  if (globalThis.config.newLine) {
    $resDiv.append('<br/>').append($res);
  } else {
    $resDiv.append($res);
  }

  $li.append($icon);
  $li.append($resDiv);

  //HTMLオブジェクトをダミー要素へ入れる
  $dummy.append($li);

  //レス番号更新
  //$('#resNumber').val(parseInt(res.number) + 1);

  // console.debug('[getRes.js]パース完了');
  // console.debug($dummy.html());

  // レス番とテキストをセットにしたJSONを返す
  const result: {
    resNumber: string;
    html: string;
  } = {
    resNumber: res.number,
    html: $dummy.html(),
  };

  // JSONオブジェクトを返却
  return result;
}

/**
 * アイコン画像取得表示のためのimgタグを返す
 * @param String // name 名前
 * @param String // id ID、板によっては非表示だったりする、困る
 */
function getIcon(name: string, id: string) {
  var src = getIconFileName(name, id);
  var $imgTag = $('<img />', { class: 'icon', src: src });
  return $imgTag;
}
/**
 * アイコン画像名取得、名前やIDを見て条件によって固定のアイコンを返す
 * @param String // name 名前
 * @param String // id ID、板によっては非表示だったりする、困る
 */
function getIconFileName(name: string, id: string) {
  // ランダムアイコン取得
  return readIcons.getRandomIcons();
}

export default router;
