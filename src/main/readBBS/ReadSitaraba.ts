/**
 * したらば読み込み用モジュール
 */
import axios, { AxiosRequestConfig } from 'axios';
import iconv from 'iconv-lite'; // 文字コード変換用パッケージ
import log from 'electron-log';
export type ShitarabaResponse = ReturnType<typeof purseResponse>;

/**
 * コンストラクタ
 */
class ReadSitaraba {
  // constructor() {}

  /**
   * レス読み込み
   * @description 引数で指定した板からレスを読む。
   * @description レス番号を指定していない場合は最新1件取得
   * @param threadUrl スレURL
   * @param resNum レス番号
   */
  read = async (threadUrl: string, resNum: number) => {
    //掲示板へのリクエスト実行
    // log.info('[ReadSitaraba.js]したらばレス取得API呼び出し開始');

    // リクエストURL作成
    // URLの「read.cgi」を「rawmode.cgi」に変換
    let requestUrl = threadUrl.replace('read.cgi', 'rawmode.cgi');
    if (resNum > 0) {
      // レス番号がある場合レス番号以降を取得
      requestUrl += resNum + '-';
    } else {
      // レス番号がない場合最新の1件取得
      requestUrl += 'l1';
    }

    // リクエストオプションの設定
    // log.info(requestUrl);
    const options: AxiosRequestConfig = {
      url: requestUrl,
      method: 'GET',
      responseType: 'arraybuffer',
      timeout: 3 * 1000,
    };
    const response = await axios(options);
    // UTF-8に変換
    const str = decodeUnicodeStr(iconv.decode(Buffer.from(response.data), 'EUC-JP'));

    const responseJson = purseNewResponse(str);

    return responseJson;
  };
}

/**
 * 取得したレスポンス（複数）のパース
 * @param res
 */
const purseNewResponse = (res: string) => {
  //結果を格納する配列
  const result: ReturnType<typeof purseResponse>[] = [];

  // 新着レスを改行ごとにSplitする
  const resArray = res.split(/\r\n|\r|\n/);
  // 1行ごとにパースする
  resArray.forEach((value) => {
    // パースメソッド呼び出し
    if (value.length > 0) {
      result.push(purseResponse(value));
    }
  });
  return result;
};

/**
 * レスポンスのパース
 * Jsonオブジェクトを返却する
 * @param String // res レスポンス1レス
 */
const purseResponse = (res: string) => {
  //APIの返却値を<>で分割
  //レスの要素
  //0:レス番号
  //1:名前
  //2:メアド
  //3:日付
  //4:本文
  //5:スレタイ
  //6:ID
  const splitRes = res.split('<>');
  const resJson = {
    number: splitRes[0],
    name: splitRes[1],
    email: splitRes[2],
    date: splitRes[3],
    text: splitRes[4],
    // threadTitle: splitRes[5],
    id: splitRes[6],
    imgUrl: '',
  };
  // オブジェクトを返却
  return resJson;
};

/** したらばだけは全角ダッシュがUnicode文字列として格納されるので変換する */
const decodeUnicodeStr = (str: string) => {
  return str.replace(/&#65374;/g, '～');
};

export default ReadSitaraba;
