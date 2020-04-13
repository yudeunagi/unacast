/**
 * アイコン表示に関するモジュール
 * シングルトン
 */
import fs from 'fs';
import path from 'path';
var log = require('electron-log');

var randomIconList: fs.Dirent[];
var idIconList;

/**
 * コンストラクタ
 * ・ランダムフォルダからアイコン名を取得してリスト化
 * ・IDフォルダからもリスト化、空の対応マップ作製
 * ・コテハン対応ファイルを読みこんでmapに格納
 */
class ReadIcons {
  constructor() {
    //画像ディレクトリ
    var randomDir = path.resolve(__dirname, `../public/img/random/`);
    console.log('[ReadIcons]loadRandomDir = ' + randomDir);
    log.info('[ReadIcons]loadRandomDir = ' + randomDir);
    //  ランダムアイコン取得
    randomIconList = readDir(randomDir);

    //ID用アイコンディレクトリ
    var idDir = path.resolve(__dirname, `../public/img/id/`);
    console.log('[ReadIcons]loadIDDir = ' + idDir);
    //  ランダムアイコン取得
    idIconList = readDir(idDir);
  }

  /**
   * アイコンランダム表示機能（デフォルト）
   * 起動時に作成したアイコンリストからランダムで1つ取得
   */
  getRandomIcons = () => {
    let iconPath = '';
    try {
      var dirName = './img/random/';
      // リストからランダム取得
      //  var size = randomIconList.size;
      var num = Math.floor(randomIconList.length * Math.random());
      log.info(JSON.stringify(randomIconList));
      iconPath = dirName + randomIconList[num];
    } catch (e) {
      log.error(e);
    }
    return iconPath;
  };
}

const readDir = (imgDir: string) => {
  var iconFileList: fs.Dirent[] = [];
  console.log('[ReadIcons.readDir]start');
  //  指定したディレクトリのアイコン取得
  var files = fs.readdirSync(imgDir, { withFileTypes: true });

  //pngファイルのみ返却リストに格納する
  files.forEach((file) => {
    console.log('[ReadIcons.readDir]file = ' + file);
    log.info('[ReadIcons.readDir]file = ' + file);
    // asar圧縮するとfileが文字列になる。開発環境だとfileオブジェクトになる
    const target = typeof file.name !== 'string' ? file : file.name;
    var regx = /.*\.png$/.test(target as any);
    if (regx) {
      iconFileList.push(target as any);
    }
  });

  console.log('[ReadIcons.readDir]end');
  log.info('[ReadIcons.readDir]end');
  log.info(JSON.stringify(iconFileList));
  return iconFileList;
};

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
export default ReadIcons;
