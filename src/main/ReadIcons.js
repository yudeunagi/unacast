/**
* アイコン表示に関するモジュール
* シングルトン
*/
const fs = require('fs');

var randomIconList;
var idIconList;

/**
* コンストラクタ
* ・ランダムフォルダからアイコン名を取得してリスト化
* ・IDフォルダからもリスト化、空の対応マップ作製
* ・コテハン対応ファイルを読みこんでmapに格納
*/
var ReadIcons = function()
{
  //画像ディレクトリ
  var randomDir = `./public/img/random/`;
  console.log('[ReadIcons]loadRandomDir = ' + randomDir);
  //  ランダムアイコン取得
  randomIconList = readDir(randomDir);

  //ID用アイコンディレクトリ
  var idDir = `./public/img/id/`;
  console.log('[ReadIcons]loadIDDir = ' + idDir);
  //  ランダムアイコン取得
  idIconList = readDir(idDir);


}

function readDir(imgDir){
  var iconFileList = [];
  console.log('[ReadIcons.readDir]start');
  //  指定したディレクトリのアイコン取得
  var files =fs.readdirSync(imgDir, {withFileTypes :true})

  //pngファイルのみ返却リストに格納する
  files.forEach(file =>{
    console.log('[ReadIcons.readDir]file = ' + file);
    var regx = /.*\.png$/.test(file);
    if(regx){
      iconFileList.push(file);
    }
  });

  console.log('[ReadIcons.readDir]end');
  return iconFileList;
}


/**
* アイコンランダム表示機能（デフォルト）
* 起動時に作成したアイコンリストからランダムで1つ取得
*/
ReadIcons.prototype.getRandomIcons = function(){

  var dirName = './img/random/'
  // リストからランダム取得
//  var size = randomIconList.size;
  var num = Math.floor(randomIconList.length * Math.random());

  return dirName + randomIconList[num];
}

/**
* IDによるアイコン固定機能（オプションでON,OFF可能）
* 初出のIDならばランダムでアイコンを取得し
* IDとファイル名のセットでマップに格納
* @param string // ID
* @return string filename
*/

/**
* コテハンリスト機能（オプションでON,OFF可能）
* koteフォルダの下にkotehan.jsonを作って
* 名前とアイコンファイル名の対応をマップにして返すだけ
*/
module.exports = new ReadIcons();
