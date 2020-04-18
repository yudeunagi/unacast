/**
 * アイコン表示に関するモジュール
 * シングルトン
 */
import fs from 'fs';
import path from 'path';
import log from 'electron-log';

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
    const randomDir = path.resolve(__dirname, `../public/img/random/`);
    console.debug('[ReadIcons]loadRandomDir = ' + randomDir);
    //  ランダムアイコン取得
    randomIconList = readDir(randomDir);

    //ID用アイコンディレクトリ
    const idDir = path.resolve(__dirname, `../public/img/id/`);
    console.debug('[ReadIcons]loadIDDir = ' + idDir);
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
      const dirName = './img/random/';
      // リストからランダム取得
      //  const size = randomIconList.size;
      const num = Math.floor(randomIconList.length * Math.random());
      iconPath = dirName + randomIconList[num];
    } catch (e) {
      log.error(e);
    }
    return iconPath;
  };
}

const readDir = (imgDir: string) => {
  const iconFileList: fs.Dirent[] = [];
  //  指定したディレクトリのアイコン取得
  const files = fs.readdirSync(imgDir, { withFileTypes: true });

  //pngファイルのみ返却リストに格納する
  files.forEach((file) => {
    // asar圧縮するとfileが文字列になる。開発環境だとfileオブジェクトになる
    const target = typeof file.name !== 'string' ? file : file.name;
    const regx = /.*\.png$/.test(target as any);
    if (regx) {
      iconFileList.push(target as any);
    }
  });

  // console.log('[ReadIcons.readDir]end');
  // console.log(JSON.stringify(iconFileList));
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
