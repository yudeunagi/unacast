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
  //新スレ一覧を改行ごとにSplitする
  var listArray = subjectTxt.split(/\r\n|\r|\n/);
  // 配列の最後に空の要素が入ることがあるので取り除く
  if(listArray[listArray.length - 1].length == 0){
    listArray.pop();
  }

  var nextUrl;
  var threadTitle;
  var lastResNumber;

  // スレッドリストはこんな感じなのでいい感じに分割する
  // 1574447681.dat<>うなぎ養殖成功2匹目 (897)
  // 1572723073.dat<>てすとすれっど (59)
  // 1572734724.dat<>うなぎ養殖成功1匹目 (1000)

  var lastThreadNumber = 0;
  console.log('[GetNextThread.js]新スレ検索 開始');
  for(var i = 0; i < listArray.length; i++){

    var item = listArray[i];
    // 最終レス番号取得
    // 1572723073.dat<>てすとすれっど (59)
    var rep = /(.*)\.dat<>(.*) \((.*)\)$/;
    var parseItem = item.replace(rep,'$1<>$2<>$3');
    var splitItem = parseItem.split('<>');
    console.log('[GetNextThread.js]新スレ取得 変換、'+ splitItem);
    lastResNumber = splitItem[2];
    console.log('[GetNextThread.js]新スレ取得 レス番判定、'+ lastResNumber);
    // レス番号が1000ならばスキップ
    if(lastResNumber >= 1000){
      continue;
    }

    //スレ番号取得
    var threadNumber = splitItem[0];
    console.log('[GetNextThread.js]新スレ取得 スレ番号、'+ threadNumber);
    //スレ番が大きい方を採用
    if(threadNumber > lastThreadNumber){
      lastThreadNumber = threadNumber;
      threadTitle = splitItem[1];
      console.log('[GetNextThread.js]新スレ更新'+ threadTitle);
    }
  }

  //新スレURLを生成する
  rep = /(.*)\/(.*)\/$/;
  var nextUrl = nowUrl.replace(rep,'$1/' + lastThreadNumber + '/' )

  console.log('[GetNextThread.js]新スレ検索 終了、新スレURL=' + nextUrl);

  // レスポンス
  var responseJson = {
    nextUrl : nextUrl
    ,threadTitle : threadTitle
    ,lastResNumber : lastResNumber
  }
  return responseJson;
}

module.exports = new GetNextThread();
