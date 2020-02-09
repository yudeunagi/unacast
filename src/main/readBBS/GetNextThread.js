/**
* 次スレ判定用モジュール
* subject.txt形式のリストからスレタイと番号で
* どれが次スレか判定する
*/
/**
* コンストラクタ
*/
var GetNextThread = function()
{
//  this.randomIconList =
}

/**
* 次スレURL取得
* @param String // subjectTxt スレッド一覧
* @param String // nowUrl 現在詠んでいるスレッドURL
* @return 次スレの情報が入ったjson
* datNumber: スレッドの番号
* threadTitle: スレタイ
* lastResNumber: 最終レス番
*/
GetNextThread.prototype.getUrl = function(subjectTxt, nowUrl){

  // subject.txtを番号、スレタイ、レス番号に分割する
  // レス番号が1000行っていない＆dat番号が後の物を返す

  // ダミー
  var responseJson = {
    nextUrl : 'https://bbs.jpnkn.com/test/read.cgi/yudeunagi/1574447681/'
    ,threadTitle : 'うなぎ養殖成功2匹目'
    ,lastResNumber : 897
  }

  return responseJson;

}

module.exports = new GetNextThread();
