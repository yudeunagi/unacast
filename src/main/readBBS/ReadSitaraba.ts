/**
 * したらば読み込み用モジュール
 */
const request = require('request-promise'); //httpリクエスト
const iconv = require('iconv-lite'); // 文字コード変換用パッケージ
var log = require('electron-log');

/**
 * コンストラクタ
 *
 */
class ReadSitaraba {
  constructor() {}
  //テストメソッド
  test = function () {
    log.debug((global as any).config);
  };

  /**
   * レス読み込み
   * 引数で指定した板からレスを読む
   * レス番号を指定していない場合は最新1件取得
   * @param String // threadUrl スレURL
   * @param String // resNum レス番号
   */
  read = async function (threadUrl: string, resNum: number) {
    //リクエストURL作成
    //URLの「read.cgi」を「rawmode.cgi」に変換
    var requestUrl = threadUrl.replace('read.cgi', 'rawmode.cgi');
    if (resNum > 0) {
      // レス番号がある場合レス番号以降を取得
      requestUrl += resNum + '-';
    } else {
      // レス番号がない場合最新の1件取得
      requestUrl += 'l1';
    }

    //リクエストオプションの設定
    var options = {
      url: requestUrl,
      method: 'GET',
      encoding: null, // ここでnull指定しないとなんかうまくいかない
    };

    var responseJson: ReturnType<typeof purseNewResponse> = [];
    //掲示板へのリクエスト実行
    log.info('[ReadSitaraba.js]したらばレス取得API呼び出し開始');

    await request(options).then((body: any) => {
      log.debug('[ReadSitaraba.js]したらばレス取得API呼び出し成功');
      //したらばAPIの文字コードはEUC-JPなのでUTF-8に変換する
      var str: string = iconv.decode(Buffer.from(body), 'EUC-JP');
      // レスポンスオブジェクト作成
      responseJson = purseNewResponse(str);
    });
    return responseJson;
  };
}

//取得したレスポンス（複数）のパース
//戻りとしてパースしたjsonオブジェクトの配列を返す
function purseNewResponse(res: string) {
  //結果を格納する配列
  const result: ReturnType<typeof purseResponse>[] = [];

  //新着レスを改行ごとにSplitする
  const resArray = res.split(/\r\n|\r|\n/);
  //1行ごとにパースする
  resArray.forEach(function (value: any) {
    //パースメソッド呼び出し
    if (value.length > 0) {
      result.push(purseResponse(value));
    }
  });
  // パースした<li>オブジェクトの配列を返却
  return result;
}

/**レスポンスのパース
 *Jsonオブジェクトを返却する
 *@param String // res レスポンス1レス
 *{
 * number: レス番号
 * name: 名前
 * email: メアド
 * date: 日付
 * text: 本文
 * threadTitle: スレタイ
 * id: ID
 *}
 */
function purseResponse(res: string) {
  //APIの返却値を<>で分割
  //レスの要素
  //0:レス番号
  //1:名前
  //2:メアド
  //3:日付
  //4:本文
  //5:スレタイ
  //6:ID
  var splitRes = res.split('<>');
  var resJson = {
    number: splitRes[0],
    name: splitRes[1],
    email: splitRes[2],
    date: splitRes[3],
    text: splitRes[4],
    threadTitle: splitRes[5],
    id: splitRes[6],
  };
  // オブジェクトを返却
  return resJson;
}

export default ReadSitaraba;
