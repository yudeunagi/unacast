/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main/ReadIcons.ts":
/*!*******************************!*\
  !*** ./src/main/ReadIcons.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * アイコン表示に関するモジュール
 * シングルトン
 */
var fs_1 = __importDefault(__webpack_require__(/*! fs */ "fs"));
var path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
var electron_log_1 = __importDefault(__webpack_require__(/*! electron-log */ "electron-log"));
var randomIconList;
var idIconList;
/**
 * コンストラクタ
 * ・ランダムフォルダからアイコン名を取得してリスト化
 * ・IDフォルダからもリスト化、空の対応マップ作製
 * ・コテハン対応ファイルを読みこんでmapに格納
 */
var ReadIcons = /** @class */ (function () {
    function ReadIcons() {
        /**
         * アイコンランダム表示機能（デフォルト）
         * 起動時に作成したアイコンリストからランダムで1つ取得
         */
        this.getRandomIcons = function () {
            var iconPath = '';
            try {
                var dirName = './img/random/';
                // リストからランダム取得
                //  const size = randomIconList.size;
                var num = Math.floor(randomIconList.length * Math.random());
                iconPath = dirName + randomIconList[num];
            }
            catch (e) {
                electron_log_1.default.error(e);
            }
            return iconPath;
        };
        //画像ディレクトリ
        var randomDir = path_1.default.resolve(__dirname, "../public/img/random/");
        console.debug('[ReadIcons]loadRandomDir = ' + randomDir);
        //  ランダムアイコン取得
        randomIconList = readDir(randomDir);
        //ID用アイコンディレクトリ
        var idDir = path_1.default.resolve(__dirname, "../public/img/id/");
        console.debug('[ReadIcons]loadIDDir = ' + idDir);
        //  ランダムアイコン取得
        idIconList = readDir(idDir);
    }
    return ReadIcons;
}());
var readDir = function (imgDir) {
    var iconFileList = [];
    //  指定したディレクトリのアイコン取得
    var files = fs_1.default.readdirSync(imgDir, { withFileTypes: true });
    //pngファイルのみ返却リストに格納する
    files.forEach(function (file) {
        // asar圧縮するとfileが文字列になる。開発環境だとfileオブジェクトになる
        var target = typeof file.name !== 'string' ? file : file.name;
        var regx = /.*\.png$/.test(target);
        if (regx) {
            iconFileList.push(target);
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
exports.default = ReadIcons;


/***/ }),

/***/ "./src/main/bouyomi-chan/index.ts":
/*!****************************************!*\
  !*** ./src/main/bouyomi-chan/index.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var net_1 = __importDefault(__webpack_require__(/*! net */ "net"));
var BouyomiChan = /** @class */ (function () {
    function BouyomiChan(options) {
        /**
         * 棒読みちゃんのホスト
         */
        this.host = 'localhost';
        /**
         * 棒読みちゃんのポート番号
         */
        this.port = 50001;
        /**
         * 速度（-1:棒読みちゃん画面上の設定）
         */
        this.speed = -1;
        /**
         * 音程（-1:棒読みちゃん画面上の設定）
         */
        this.tone = -1;
        /**
         * 音量（-1:棒読みちゃん画面上の設定）
         */
        this.volume = -1;
        /**
         * 声質（ 0:棒読みちゃん画面上の設定、1:女性1、2:女性2、3:男性1、4:男性2、5:中性、6:ロボット、7:機械1、8:機械2、10001～:SAPI5）
         */
        this.type = 0;
        if (!options)
            return;
        if (options.host)
            this.host = options.host;
        if (options.port)
            this.port = options.port;
        if (options.speed)
            this.speed = options.speed;
        if (options.tone)
            this.tone = options.tone;
        if (options.volume)
            this.volume = options.volume;
        if (options.type)
            this.type = options.type;
    }
    /**
     * @param message 棒読みちゃんに読み上げてもらう文章
     */
    BouyomiChan.prototype.speak = function (message) {
        /** 棒読みちゃんに送信する設定のバイト長 */
        var SETTINGS_BYTES_LENGTH = 15;
        var messageByteLength = Buffer.byteLength(message);
        var bufferLength = SETTINGS_BYTES_LENGTH + messageByteLength;
        var buff = Buffer.alloc(bufferLength);
        /** メッセージ読み上げコマンド */
        var COMMAND_TO_SPEAK = 1;
        var len = buff.writeUInt16LE(COMMAND_TO_SPEAK);
        len = buff.writeInt16LE(this.speed, len);
        len = buff.writeInt16LE(this.tone, len);
        len = buff.writeInt16LE(this.volume, len);
        len = buff.writeUInt16LE(this.type, len);
        /** 文字コード(0:UTF-8, 1:Unicode, 2:Shift-JIS) */
        var ENCODING = 0;
        len = buff.writeUInt8(ENCODING, len);
        len = buff.writeUInt32LE(messageByteLength, len);
        len = buff.write(message, len);
        var client = net_1.default.createConnection(this.port, this.host);
        client.write(buff);
        client.end();
    };
    return BouyomiChan;
}());
exports.default = BouyomiChan;


/***/ }),

/***/ "./src/main/const.ts":
/*!***************************!*\
  !*** ./src/main/const.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.electronEvent = {
    /** サーバー起動 */
    'start-server': 'start-server',
    /** サーバー停止 */
    'stop-server': 'stop-server',
    /** Config適用 */
    'apply-config': 'apply-config',
    /** アラート表示 */
    'show-alert': 'show-alert',
    /** 棒読み再生 */
    'play-tamiyasu': 'play-tamiyasu',
    /** レス着信音再生 */
    'play-sound-start': 'play-sound-start',
    'play-sound-end': 'play-sound-end',
    'wait-yomiko-time': 'wait-yomiko-time',
    'speaking-end': 'speaking-end',
    /** コメント表示 */
    'show-comment': 'show-comment',
    /** コメント欄初期化 */
    'clear-comment': 'clear-comment',
    /** サーバー起動の返信 */
    'start-server-reply': 'start-server-reply',
};


/***/ }),

/***/ "./src/main/getRes.ts":
/*!****************************!*\
  !*** ./src/main/getRes.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(__webpack_require__(/*! express */ "express"));
var body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ "body-parser")); // jsonパーサ
var router = express_1.default.Router();
var electron_log_1 = __importDefault(__webpack_require__(/*! electron-log */ "electron-log"));
var ReadIcons_1 = __importDefault(__webpack_require__(/*! ./ReadIcons */ "./src/main/ReadIcons.ts")); //アイコンファイル名取得
var readIcons = new ReadIcons_1.default();
var startServer_1 = __webpack_require__(/*! ./startServer */ "./src/main/startServer.ts");
var readSitaraba_1 = __importDefault(__webpack_require__(/*! ./readBBS/readSitaraba */ "./src/main/readBBS/readSitaraba.ts")); // したらば読み込み用モジュール
var Read5ch_1 = __importDefault(__webpack_require__(/*! ./readBBS/Read5ch */ "./src/main/readBBS/Read5ch.ts")); // 5ch互換板読み込み用モジュール
var sitaraba = new readSitaraba_1.default();
var read5ch = new Read5ch_1.default();
// 掲示板読み込みモジュール、一度決定したら使いまわすためにグローバル宣言
var bbsModule = null;
// リクエストのbodyをパース下りエンコードしたりするためのやつ
router.use(body_parser_1.default.urlencoded({ extended: true }));
router.use(body_parser_1.default.json());
/**
 * ブラウザからの初期処理リクエスト
 */
router.get('/', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var threadUrl, resNum, result, doms;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                threadUrl = globalThis.config.url;
                resNum = globalThis.config.resNumber ? Number(globalThis.config.resNumber) : NaN;
                res.header('Content-Type', 'application/json; charset=UTF-8');
                return [4 /*yield*/, exports.getRes(threadUrl, resNum)];
            case 1:
                result = _a.sent();
                result.shift();
                doms = result.map(function (item) { return startServer_1.createDom(item); });
                res.send(JSON.stringify(doms));
                return [2 /*return*/];
        }
    });
}); });
/**
 * 掲示板のレスを取得する
 * @param threadUrl スレのURL
 * @param resNum この番号以降を取得する。指定しない場合は最新1件を取得。
 */
exports.getRes = function (threadUrl, resNum) { return __awaiter(void 0, void 0, void 0, function () {
    var response, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // リクエストURLを解析し、使用するモジュールを変更する
                bbsModule = analysBBSName(threadUrl);
                return [4 /*yield*/, bbsModule.read(threadUrl, resNum)];
            case 1:
                response = _a.sent();
                globalThis.electron.threadConnectionError = 0;
                console.log("[getRes.js] fetch " + threadUrl + " resNum = " + resNum + ", result = " + response.length);
                return [2 /*return*/, response.map(function (res) {
                        return __assign(__assign({}, res), { imgUrl: readIcons.getRandomIcons() });
                    })];
            case 2:
                e_1 = _a.sent();
                electron_log_1.default.error(e_1);
                // エラー回数が規定回数以上かチェックして、超えてたら通知する
                if (globalThis.config.notifyThreadConnectionErrorLimit > 0) {
                    globalThis.electron.threadConnectionError += 1;
                    if (globalThis.electron.threadConnectionError >= globalThis.config.notifyThreadConnectionErrorLimit) {
                        electron_log_1.default.info('[getRes] エラー回数超過');
                        globalThis.electron.threadConnectionError = 0;
                        return [2 /*return*/, [
                                {
                                    name: 'unacastより',
                                    imgUrl: './img/unacast.png',
                                    text: '掲示板が規定回数通信エラーになりました。設定を見直すか、掲示板URLを変更してください。',
                                },
                            ]];
                    }
                }
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
/*
 * URLをみてどこのBBSか判定して使用するモジュールを返却する
 */
var analysBBSName = function (threadUrl) {
    // したらばドメイン名
    var sitarabaDomain = 'jbbs.shitaraba.net';
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
exports.default = router;


/***/ }),

/***/ "./src/main/main.ts":
/*!**************************!*\
  !*** ./src/main/main.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Electronのモジュール
var path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
var electron_1 = __importStar(__webpack_require__(/*! electron */ "electron"));
var electron_log_1 = __importDefault(__webpack_require__(/*! electron-log */ "electron-log"));
var util_1 = __webpack_require__(/*! ./util */ "./src/main/util.ts");
console.trace = function () {
    //
};
process.on('uncaughtException', function (err) {
    electron_log_1.default.error(err);
});
// アプリケーションをコントロールするモジュール
var app = electron_1.default.app;
// 多重起動防止
if (!app.requestSingleInstanceLock()) {
    electron_log_1.default.error('[app] It is terminated for multiple launches.');
    app.quit();
}
else {
    electron_log_1.default.info('[app] started');
    app.allowRendererProcessReuse = true;
    var iconPath_1 = path_1.default.resolve(__dirname, '../icon.png');
    // サーバー起動モジュール
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    var ss = __webpack_require__(/*! ./startServer */ "./src/main/startServer.ts");
    console.trace(ss);
    // ウィンドウを作成するモジュール
    var BrowserWindow_1 = electron_1.default.BrowserWindow;
    // メインウィンドウはGCされないようにグローバル宣言
    globalThis.electron = {
        mainWindow: null,
        chatWindow: null,
        seList: [],
        twitchChat: null,
        youtubeChat: null,
        threadConnectionError: 0,
        threadNumber: 0,
        commentQueueList: [],
    };
    globalThis.config = {};
    // 全てのウィンドウが閉じたら終了
    // app.on('window-all-closed', () => {
    //   if (process.platform != 'darwin') {
    //     app.quit();
    //   }
    // });
    // Electronの初期化完了後に実行
    app.on('ready', function () {
        // ウィンドウサイズを（フレームサイズを含まない）設定
        globalThis.electron.mainWindow = new BrowserWindow_1({
            width: 700,
            height: 720,
            useContentSize: true,
            icon: iconPath_1,
            webPreferences: {
                nodeIntegration: true,
            },
            skipTaskbar: true,
        });
        globalThis.electron.mainWindow.setTitle('unacast');
        globalThis.electron.mainWindow.setMenu(null);
        // レンダラーで使用するhtmlファイルを指定する
        globalThis.electron.mainWindow.loadURL(path_1.default.resolve(__dirname, '../src/html/index.html'));
        // ウィンドウが閉じられたらアプリも終了
        globalThis.electron.mainWindow.on('close', function (event) {
            // 確認ダイアログではいをクリックしたら閉じる
            event.preventDefault();
            electron_1.dialog
                .showMessageBox(globalThis.electron.mainWindow, {
                type: 'question',
                buttons: ['Yes', 'No'],
                // title: '',
                message: '終了しますか？',
            })
                .then(function (value) {
                if (value.response === 0) {
                    app.exit();
                }
            });
        });
        globalThis.electron.mainWindow.on('closed', function () {
            electron_log_1.default.info('[app] close');
            app.exit();
        });
        // 開発者ツールを開く
        // globalThis.electron.mainWindow.webContents.openDevTools();
        // タスクトレイの設定
        var tray = null;
        app.whenReady().then(function () {
            tray = new electron_1.Tray(iconPath_1);
            var contextMenu = electron_1.Menu.buildFromTemplate([
                {
                    label: '設定',
                    click: function () {
                        globalThis.electron.mainWindow.focus();
                    },
                },
                {
                    label: 'コメント',
                    click: function () {
                        globalThis.electron.chatWindow.focus();
                    },
                },
                {
                    label: '終了',
                    click: function () {
                        globalThis.electron.mainWindow.close();
                    },
                },
            ]);
            tray.setToolTip('∈(ﾟ◎ﾟ)∋ｳﾅｰ');
            tray.setContextMenu(contextMenu);
            // タスクトレイクリック時の挙動
            var isDoubleClicked = false;
            tray.on('click', function (event) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isDoubleClicked = false;
                            return [4 /*yield*/, util_1.sleep(200)];
                        case 1:
                            _a.sent();
                            if (isDoubleClicked)
                                return [2 /*return*/];
                            globalThis.electron.chatWindow.focus();
                            return [2 /*return*/];
                    }
                });
            }); });
            tray.on('double-click', function (event) {
                isDoubleClicked = true;
                globalThis.electron.mainWindow.focus();
            });
        });
        createChatWindow_1();
    });
    var createChatWindow_1 = function () {
        var chatWindow = new BrowserWindow_1({
            width: 400,
            useContentSize: true,
            icon: iconPath_1,
            webPreferences: {
                nodeIntegration: true,
            },
            // タスクバーに表示しない
            skipTaskbar: true,
            // 閉じれなくする
            closable: false,
        });
        chatWindow.setTitle('unacast');
        chatWindow.setMenu(null);
        // レンダラーで使用するhtmlファイルを指定する
        chatWindow.loadURL(path_1.default.resolve(__dirname, '../src/html/chat.html'));
        globalThis.electron.chatWindow = chatWindow;
        // chatWindow.webContents.openDevTools();
    };
    // 音声再生できるようにする
    app.commandLine.appendSwitch('--autoplay-policy', 'no-user-gesture-required');
}


/***/ }),

/***/ "./src/main/readBBS/Read5ch.ts":
/*!*************************************!*\
  !*** ./src/main/readBBS/Read5ch.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 5ch互換BBS読み込み用モジュール
 */
var axios_1 = __importDefault(__webpack_require__(/*! axios */ "axios"));
var https_1 = __importDefault(__webpack_require__(/*! https */ "https"));
var iconv_lite_1 = __importDefault(__webpack_require__(/*! iconv-lite */ "iconv-lite")); // 文字コード変換用パッケージ
var electron_log_1 = __importDefault(__webpack_require__(/*! electron-log */ "electron-log"));
// ステータスコード304 _NotModified
var NOT_MODIFIED = '304';
var RANGE_NOT_SATISFIABLE = '416';
// 最終取得スレッド
var lastThreadUrl = '';
// 最終レス番号
var lastResNumber = 0;
//最終更新日時
var lastModified = null;
// 最終バイト数
var lastByte = 0;
/**
 * コンストラクタ
 *
 */
var Read5ch = /** @class */ (function () {
    function Read5ch() {
        var _this = this;
        // constructor() {}
        /**
         * レス読み込み
         * 引数で指定した板からレスを読む
         * レス番号を指定していない場合は最新1件取得
         * @param threadUrl スレURL
         * @param resNum レス番号
         */
        this.read = function (threadUrl, resNum) { return __awaiter(_this, void 0, void 0, function () {
            var rep, requestUrl, range, options, instance, responseJson, response, headers, str, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // log.info(`[Read5ch] threadUrl=${threadUrl} resNum=${resNum}`);
                        // 板や最終日レス番号がかわったら最初からとり直す(lastmodifiと rangeのリセット)
                        if (threadUrl != lastThreadUrl || Number.isNaN(resNum) || resNum < lastResNumber) {
                            lastThreadUrl = threadUrl;
                            lastModified = null;
                            lastByte = 0;
                            console.trace('[Read5ch.js]resete!!!!!!!!!!!!!!!!');
                        }
                        else {
                            console.trace('noresete');
                        }
                        rep = /\/test\/read.cgi(\/.+)(\/.+)\//;
                        requestUrl = threadUrl.replace(rep, '$1/dat$2.dat');
                        range = lastByte;
                        options = {
                            url: requestUrl,
                            method: 'GET',
                            timeout: 3 * 1000,
                            responseType: 'arraybuffer',
                            headers: {
                                'if-modified-since': lastModified,
                                range: 'bytes=' + range + '-',
                            },
                        };
                        instance = axios_1.default.create({
                            httpsAgent: new https_1.default.Agent({
                                rejectUnauthorized: false,
                            }),
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, instance(options)];
                    case 2:
                        response = _a.sent();
                        headers = response.headers;
                        // LastModifiedとRange更新処理
                        if (headers['last-modified'] != null) {
                            lastModified = headers['last-modified'];
                        }
                        str = iconv_lite_1.default.decode(Buffer.from(response.data), 'Shift_JIS');
                        // レスポンスオブジェクト作成、content-rangeがある場合とない場合で処理を分ける
                        if (headers['content-range'] == null || lastByte == 0) {
                            console.trace('[Read5ch.read]content-range=' + headers['content-range']);
                            responseJson = purseNewResponse(str, resNum);
                        }
                        else {
                            responseJson = purseDiffResponse(str, resNum);
                        }
                        // 取得バイト数表示
                        if (headers['content-length'] != null && responseJson.length > 0) {
                            lastByte = lastByte + parseInt(headers['content-length']) - 1;
                            console.trace('[Read5ch.read]lastByte=' + lastByte);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        responseJson = [];
                        if (error_1.status == NOT_MODIFIED) {
                            electron_log_1.default.error('[Read5ch.js]5ch系BBSレス取得APIリクエストエラー、NOT_MODIFIED');
                        }
                        else if (error_1.status == RANGE_NOT_SATISFIABLE) {
                            electron_log_1.default.error('[Read5ch.js]5ch系BBSレス取得APIリクエストエラー、RANGE_NOT_SATISFIABLE');
                        }
                        else {
                            electron_log_1.default.error('[Read5ch.js]5ch系BBSレス取得APIリクエストエラー、message=' + error_1.message);
                        }
                        throw new Error('connection error');
                    case 4: return [2 /*return*/, responseJson];
                }
            });
        }); };
    }
    return Read5ch;
}());
/**
 * 取得したレスポンス（複数）のパース
 * 戻りとしてパースしたjsonオブジェクトの配列を返す
 * @param res 板から返却されたdat
 * @param resNum リクエストされたレス番号
 */
var purseNewResponse = function (res, resNum) {
    // 結果を格納する配列
    var result = [];
    // レス番号
    var num = 0;
    // 新着レスを改行ごとにSplitする
    var resArray = res.split(/\r\n|\r|\n/);
    // 新着なしなら戻る。
    if (resArray.length === 0) {
        return result;
    }
    // 配列の最後に空の要素が入ることがあるので取り除く
    if (resArray[resArray.length - 1].length === 0) {
        resArray.pop();
    }
    // レス指定なしの場合最後の1件取得
    if (Number.isNaN(resNum)) {
        num = resArray.length - 1;
    }
    else {
        num = resNum - 1;
    }
    // 1行ごとにパースする
    for (; num < resArray.length; num++) {
        // パースメソッド呼び出し
        if (resArray[num].length > 0) {
            result.push(purseResponse(resArray[num], num + 1));
        }
    }
    lastResNumber = num + 1;
    // パースしたオブジェクトの配列を返却
    return result;
};
/**
 * 取得したレスポンス（複数）のパース
 * 戻りとしてパースしたjsonオブジェクトの配列を返す
 * @param res 板から返却されたdat1行分
 * @param resNum リクエストされたレス番号
 */
var purseDiffResponse = function (res, resNum) {
    //結果を格納する配列
    var result = [];
    // レス番号
    var num = resNum;
    //新着レスを改行ごとにSplitする
    var resArray = res.split(/\r\n|\r|\n/);
    // 新着なしなら戻る。
    if (resArray.length === 0) {
        return result;
    }
    else {
        // 配列の最後に空の要素が入ることがあるので取り除く
        if (resArray[resArray.length - 1].length == 0) {
            resArray.pop();
        }
    }
    console.trace('[Read5ch.purseDiffResponse]取得レス番号=' + num);
    //1行ごとにパースする
    resArray.forEach(function (value) {
        //パースメソッド呼び出し
        if (value.length > 0) {
            result.push(purseResponse(value, num));
            num++;
        }
    });
    // パースしたオブジェクトの配列を返却
    return result;
};
/**
 * レスポンスのパース
 * Jsonオブジェクトを返却する
 * @param String // res レスポンス1レス
 * @param Integer // num レス番（0スタート）
 */
var purseResponse = function (res, num) {
    //APIの返却値を<>で分割
    //レスの要素
    //0:名前
    //1:メアド
    //2:日付とID （2019/11/03(日) 08:55:00 ID:kanikani）みたいに表示
    //3:本文
    //4:スレタイ （1レス目のみ）
    var splitRes = res.split('<>');
    // 日付とID分離処理、' ID:'で区切る
    var dateId = splitRes[2].split(' ID:');
    var date = dateId[0];
    var id = dateId.length === 2 ? dateId[1] : '';
    var resJson = {
        number: num.toString(),
        name: splitRes[0],
        email: splitRes[1],
        date: date,
        text: splitRes[3],
        // threadTitle: splitRes[4],
        id: id,
        imgUrl: '',
    };
    // オブジェクトを返却
    return resJson;
};
exports.default = Read5ch;


/***/ }),

/***/ "./src/main/readBBS/readSitaraba.ts":
/*!******************************************!*\
  !*** ./src/main/readBBS/readSitaraba.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * したらば読み込み用モジュール
 */
var axios_1 = __importDefault(__webpack_require__(/*! axios */ "axios"));
var https_1 = __importDefault(__webpack_require__(/*! https */ "https"));
var iconv_lite_1 = __importDefault(__webpack_require__(/*! iconv-lite */ "iconv-lite")); // 文字コード変換用パッケージ
/**
 * コンストラクタ
 */
var ReadSitaraba = /** @class */ (function () {
    function ReadSitaraba() {
        // constructor() {}
        var _this = this;
        /**
         * レス読み込み
         * @description 引数で指定した板からレスを読む。
         * @description レス番号を指定していない場合は最新1件取得
         * @param threadUrl スレURL
         * @param resNum レス番号
         */
        this.read = function (threadUrl, resNum) { return __awaiter(_this, void 0, void 0, function () {
            var requestUrl, options, instance, response, str, responseJson;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        requestUrl = threadUrl.replace('read.cgi', 'rawmode.cgi');
                        if (resNum > 0) {
                            // レス番号がある場合レス番号以降を取得
                            requestUrl += resNum + '-';
                        }
                        else {
                            // レス番号がない場合最新の1件取得
                            requestUrl += 'l1';
                        }
                        options = {
                            url: requestUrl,
                            method: 'GET',
                            responseType: 'arraybuffer',
                            timeout: 3 * 1000,
                            headers: {
                                Accept: '*/*',
                            },
                        };
                        instance = axios_1.default.create({
                            httpsAgent: new https_1.default.Agent({
                                rejectUnauthorized: false,
                            }),
                        });
                        return [4 /*yield*/, instance(options)];
                    case 1:
                        response = _a.sent();
                        str = decodeUnicodeStr(iconv_lite_1.default.decode(Buffer.from(response.data), 'EUC-JP'));
                        responseJson = purseNewResponse(str);
                        return [2 /*return*/, responseJson];
                }
            });
        }); };
    }
    return ReadSitaraba;
}());
/**
 * 取得したレスポンス（複数）のパース
 * @param res
 */
var purseNewResponse = function (res) {
    //結果を格納する配列
    var result = [];
    // 新着レスを改行ごとにSplitする
    var resArray = res.split(/\r\n|\r|\n/);
    // 1行ごとにパースする
    resArray.forEach(function (value) {
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
var purseResponse = function (res) {
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
        // threadTitle: splitRes[5],
        id: splitRes[6],
        imgUrl: '',
    };
    // オブジェクトを返却
    return resJson;
};
/** したらばだけは全角ダッシュがUnicode文字列として格納されるので変換する */
var decodeUnicodeStr = function (str) {
    return str.replace(/&#65374;/g, '～');
};
exports.default = ReadSitaraba;


/***/ }),

/***/ "./src/main/startServer.ts":
/*!*********************************!*\
  !*** ./src/main/startServer.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(__webpack_require__(/*! path */ "path"));
var express_1 = __importDefault(__webpack_require__(/*! express */ "express"));
var electron_log_1 = __importDefault(__webpack_require__(/*! electron-log */ "electron-log"));
var dank_twitch_irc_1 = __webpack_require__(/*! dank-twitch-irc */ "dank-twitch-irc");
var youtube_chat_1 = __webpack_require__(/*! ./youtube-chat */ "./src/main/youtube-chat/index.ts");
var electron_1 = __webpack_require__(/*! electron */ "electron");
var express_ws_1 = __importDefault(__webpack_require__(/*! express-ws */ "express-ws"));
var util_1 = __webpack_require__(/*! ./util */ "./src/main/util.ts");
// レス取得APIをセット
var getRes_1 = __importStar(__webpack_require__(/*! ./getRes */ "./src/main/getRes.ts"));
var bouyomi_chan_1 = __importDefault(__webpack_require__(/*! ./bouyomi-chan */ "./src/main/bouyomi-chan/index.ts"));
var child_process_1 = __webpack_require__(/*! child_process */ "child_process");
var const_1 = __webpack_require__(/*! ./const */ "./src/main/const.ts");
var app;
// サーバーをグローバル変数にセットできるようにする（サーバー停止処理のため）
var server;
/** 棒読みちゃんインスタンス */
var bouyomi;
/** スレッド定期取得実行するか */
var threadIntervalEvent = false;
/** キュー処理実行するか */
var isExecuteQue = false;
/** 接続中の全WebSocket */
var aWss;
var serverId = 0;
/**
 * 設定の適用
 */
electron_1.ipcMain.on(const_1.electronEvent['apply-config'], function (event, config) { return __awaiter(void 0, void 0, void 0, function () {
    var isChangedUrl, isChangeSePath, ret;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                electron_log_1.default.info('[apply-config] start');
                electron_log_1.default.info(config);
                isChangedUrl = globalThis.config.url !== config.url;
                isChangeSePath = globalThis.config.sePath !== config.sePath;
                globalThis.config = config;
                if (!isChangeSePath) return [3 /*break*/, 2];
                return [4 /*yield*/, exports.findSeList()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                // initメッセージ
                resetInitMessage();
                if (!isChangedUrl) return [3 /*break*/, 4];
                return [4 /*yield*/, getRes_1.getRes(globalThis.config.url, NaN)];
            case 3:
                ret = _a.sent();
                console.log(ret);
                if (ret.length === 0) {
                    globalThis.electron.mainWindow.webContents.send(const_1.electronEvent['show-alert'], '掲示板URLがおかしそうです');
                    return [2 /*return*/];
                }
                globalThis.electron.threadNumber = Number(ret[ret.length - 1].number);
                electron_log_1.default.info("[apply-config] new res num is " + globalThis.electron.threadNumber);
                // チャットウィンドウとブラウザに、末尾のスレだけ反映する
                sendDom([ret[ret.length - 1]]);
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * サーバー起動
 */
electron_1.ipcMain.on(const_1.electronEvent['start-server'], function (event, config) { return __awaiter(void 0, void 0, void 0, function () {
    var expressInstance;
    return __generator(this, function (_a) {
        globalThis.electron.chatWindow.webContents.send(const_1.electronEvent['clear-comment']);
        globalThis.electron.threadNumber = 0;
        globalThis.electron.commentQueueList = [];
        globalThis.electron.threadConnectionError = 0;
        serverId = new Date().getTime();
        expressInstance = express_ws_1.default(express_1.default());
        app = expressInstance.app;
        aWss = expressInstance.getWss();
        app.set('view engine', 'ejs');
        // viewディレクトリの指定
        app.set('views', path_1.default.resolve(__dirname, '../views'));
        // 設定情報をグローバル変数へセットする
        globalThis.config = config;
        console.log('[startServer]設定値 = ');
        console.log(globalThis.config);
        app.get('/', function (req, res, next) {
            res.render('server', config);
            req.connection.end();
        });
        // サーバー設定のIF
        app.get('/config', function (req, res, next) {
            res.send(JSON.stringify(globalThis.config));
        });
        // 静的コンテンツはpublicディレクトリの中身を使用するという宣言
        app.use(express_1.default.static(path_1.default.resolve(__dirname, '../public')));
        // 2ch互換掲示板の取得
        app.use('/getRes', getRes_1.default);
        // SEを取得する
        if (globalThis.config.sePath) {
            exports.findSeList();
        }
        // Twitchに接続
        if (globalThis.config.twitchId) {
            startTwitchChat();
        }
        // Youtubeチャット
        if (globalThis.config.youtubeId) {
            startYoutubeChat();
        }
        // 棒読みちゃん接続
        if (config.typeYomiko === 'bouyomi') {
            if (config.bouyomiPort) {
                bouyomi = new bouyomi_chan_1.default({ port: config.bouyomiPort, volume: config.bouyomiVolume });
            }
        }
        // レス取得定期実行
        threadIntervalEvent = true;
        getResInterval(serverId);
        // キュー処理の開始
        isExecuteQue = true;
        taskScheduler(serverId);
        // WebSocketを立てる
        app.ws('/ws', function (ws, req) {
            ws.on('message', function (message) {
                console.trace('Received: ' + message);
                if (message === 'ping') {
                    ws.send('pong');
                }
            });
            ws.on('close', function () {
                console.log('I lost a client');
            });
        });
        // 指定したポートで待ち受け開始
        server = app.listen(config.port, function () {
            console.log('[startServer] start server on port:' + config.port);
        });
        // 成功メッセージ返却
        event.returnValue = 'success';
        return [2 /*return*/];
    });
}); });
exports.findSeList = function () { return __awaiter(void 0, void 0, void 0, function () {
    var list, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                if (!globalThis.config.sePath) return [3 /*break*/, 2];
                return [4 /*yield*/, util_1.readWavFiles(globalThis.config.sePath)];
            case 1:
                list = _a.sent();
                globalThis.electron.seList = list.map(function (file) { return globalThis.config.sePath + "/" + file; });
                console.log("SE files = " + globalThis.electron.seList.length);
                return [3 /*break*/, 3];
            case 2:
                globalThis.electron.seList = [];
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                globalThis.electron.mainWindow.webContents.send(const_1.electronEvent['show-alert'], '着信音のパスがおかしそうです');
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
/**
 * Twitchチャットに接続
 * @description 再接続処理はライブラリが勝手にやってくれる
 */
var startTwitchChat = function () { return __awaiter(void 0, void 0, void 0, function () {
    var twitchChat;
    return __generator(this, function (_a) {
        try {
            twitchChat = new dank_twitch_irc_1.ChatClient();
            twitchChat.connect();
            twitchChat.join(globalThis.config.twitchId);
            // チャット受信
            twitchChat.on('PRIVMSG', function (msg) {
                electron_log_1.default.info('[Twitch] comment received');
                // log.info(JSON.stringify(msg, null, '  '));
                var imgUrl = './img/twitch.png';
                var name = util_1.escapeHtml(msg.displayName);
                var text = util_1.escapeHtml(msg.messageText);
                // エモートを画像タグにする
                msg.emotes.map(function (emote) {
                    text = text.replace(emote.code, "<img src=\"https://static-cdn.jtvnw.net/emoticons/v1/" + emote.id + "/1.0\" />");
                });
                globalThis.electron.commentQueueList.push({ imgUrl: imgUrl, name: name, text: text });
            });
            globalThis.electron.twitchChat = twitchChat;
        }
        catch (e) {
            electron_log_1.default.error(e);
        }
        return [2 /*return*/];
    });
}); };
/** Youtubeチャットに接続 */
var startYoutubeChat = function () { return __awaiter(void 0, void 0, void 0, function () {
    var tubeResult, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                electron_log_1.default.info('[Youtube Chat] connect started');
                globalThis.electron.youtubeChat = new youtube_chat_1.LiveChat({ channelId: globalThis.config.youtubeId });
                // 接続開始イベント
                globalThis.electron.youtubeChat.on('start', function (liveId) {
                    electron_log_1.default.info("[Youtube Chat] connected liveId = " + liveId);
                });
                // 接続終了イベント
                globalThis.electron.youtubeChat.on('end', function (reason) {
                    electron_log_1.default.info('[Youtube Chat] disconnect');
                });
                // チャット受信
                globalThis.electron.youtubeChat.on('comment', function (comment) {
                    var _a, _b;
                    electron_log_1.default.info('[Youtube] comment received');
                    // log.info(JSON.stringify(comment, null, '  '));
                    var imgUrl = (_b = (_a = comment.author.thumbnail) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : '';
                    var name = util_1.escapeHtml(comment.author.name);
                    // 絵文字と結合する
                    var text = '';
                    for (var _i = 0, _c = comment.message; _i < _c.length; _i++) {
                        var message = _c[_i];
                        var txtItem = message.text;
                        if (txtItem) {
                            text += util_1.escapeHtml(txtItem);
                        }
                        else {
                            var imageItem = message;
                            text += "<img src=\"" + imageItem.url + "\" width=\"" + 24 + "\" height=\"" + 24 + "\" />";
                        }
                    }
                    // const text = escapeHtml((comment.message[0] as any).text);
                    globalThis.electron.commentQueueList.push({ imgUrl: imgUrl, name: name, text: text });
                });
                // 何かエラーがあった
                globalThis.electron.youtubeChat.on('error', function (err) {
                    electron_log_1.default.error("[Youtube Chat] error " + err.message);
                    // log.error(err);
                    // globalThis.electron.youtubeChat.stop();
                });
                return [4 /*yield*/, globalThis.electron.youtubeChat.start()];
            case 1:
                tubeResult = _a.sent();
                if (!!tubeResult) return [3 /*break*/, 3];
                return [4 /*yield*/, util_1.sleep(5000)];
            case 2:
                _a.sent();
                startYoutubeChat();
                _a.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                e_2 = _a.sent();
                // たぶんここには来ない
                electron_log_1.default.error(e_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
/**
 * サーバー停止
 */
electron_1.ipcMain.on(const_1.electronEvent['stop-server'], function (event) {
    console.log('[startServer]server stop');
    server.close();
    aWss.close();
    app = null;
    event.returnValue = 'stop';
    // キュー処理停止
    isExecuteQue = false;
    globalThis.electron.commentQueueList = [];
    // レス取得の停止
    threadIntervalEvent = false;
    // Twitchチャットの停止
    if (globalThis.electron.twitchChat) {
        globalThis.electron.twitchChat.close();
        globalThis.electron.twitchChat.removeAllListeners();
    }
    // Youtubeチャットの停止
    if (globalThis.electron.youtubeChat) {
        globalThis.electron.youtubeChat.stop();
        globalThis.electron.youtubeChat.removeAllListeners();
    }
});
var getResInterval = function (exeId) { return __awaiter(void 0, void 0, void 0, function () {
    var resNum, isfirst, result, _loop_1, _i, result_1, item;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                isfirst = false;
                if (!globalThis.electron.threadNumber) {
                    // 初回
                    isfirst = true;
                    resNum = globalThis.config.resNumber ? Number(globalThis.config.resNumber) : NaN;
                }
                else {
                    // 2回目以降
                    resNum = globalThis.electron.threadNumber;
                }
                return [4 /*yield*/, getRes_1.getRes(globalThis.config.url, resNum)];
            case 1:
                result = _a.sent();
                // 指定したレス番は除外対象
                if (!isfirst)
                    result.shift();
                if (result.length > 0 && result[result.length - 1].number) {
                    globalThis.electron.threadNumber = Number(result[result.length - 1].number);
                    if (isfirst) {
                        // 初回取得の時はチャットウィンドウにだけ表示
                        sendDomForChatWindow(result);
                    }
                    else {
                        _loop_1 = function (item) {
                            // リストに同じレス番があったら追加しない
                            if (!globalThis.electron.commentQueueList.find(function (comment) { return comment.number === item.number; })) {
                                globalThis.electron.commentQueueList.push(item);
                            }
                        };
                        for (_i = 0, result_1 = result; _i < result_1.length; _i++) {
                            item = result_1[_i];
                            _loop_1(item);
                        }
                    }
                }
                else if (result.length > 0) {
                    // 番号が無くて結果が入ってるのは通信エラーメッセージ
                    sendDomForChatWindow(result);
                }
                return [4 /*yield*/, notifyThreadResLimit()];
            case 2:
                _a.sent();
                if (!(threadIntervalEvent && exeId === serverId)) return [3 /*break*/, 4];
                return [4 /*yield*/, util_1.sleep(globalThis.config.interval * 1000)];
            case 3:
                _a.sent();
                getResInterval(exeId);
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
/** レス番が上限かチェックして、超えてたら通知する */
var notifyThreadResLimit = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(globalThis.config.notifyThreadResLimit > 0 && globalThis.electron.threadNumber >= globalThis.config.notifyThreadResLimit)) return [3 /*break*/, 2];
                globalThis.electron.commentQueueList.push({
                    name: 'unacastより',
                    imgUrl: './img/unacast.png',
                    text: "\u30EC\u30B9\u304C" + globalThis.config.notifyThreadResLimit + "\u3092\u8D85\u3048\u307E\u3057\u305F\u3002\u6B21\u30B9\u30EC\u3092\u7ACB\u3066\u3066\u304F\u3060\u3055\u3044\u3002",
                });
                // TODO: 次スレ検索ポーリング処理を走らせる
                // スレ立て中だと思うのでちょっと待つ
                return [4 /*yield*/, util_1.sleep(10 * 1000)];
            case 1:
                // TODO: 次スレ検索ポーリング処理を走らせる
                // スレ立て中だと思うのでちょっと待つ
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
/**
 * キューに溜まったコメントを処理する
 */
var taskScheduler = function (exeId) { return __awaiter(void 0, void 0, void 0, function () {
    var temp, comment;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                if (!(((_b = (_a = globalThis.electron) === null || _a === void 0 ? void 0 : _a.commentQueueList) === null || _b === void 0 ? void 0 : _b.length) > 0)) return [3 /*break*/, 3];
                electron_log_1.default.info("[taskScheduler] " + ((_d = (_c = globalThis.electron) === null || _c === void 0 ? void 0 : _c.commentQueueList) === null || _d === void 0 ? void 0 : _d.length));
                if (!(globalThis.config.commentProcessType === 0)) return [3 /*break*/, 1];
                temp = __spreadArrays(globalThis.electron.commentQueueList);
                globalThis.electron.commentQueueList = [];
                // 新着が上の場合は逆順にする
                if (!globalThis.config.dispSort) {
                    temp = temp.reverse();
                }
                sendDom(temp);
                return [3 /*break*/, 3];
            case 1:
                comment = globalThis.electron.commentQueueList.shift();
                return [4 /*yield*/, sendDom([comment])];
            case 2:
                _e.sent();
                _e.label = 3;
            case 3:
                if (!(isExecuteQue && exeId === serverId)) return [3 /*break*/, 5];
                return [4 /*yield*/, util_1.sleep(100)];
            case 4:
                _e.sent();
                taskScheduler(exeId);
                _e.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
/** 読み子によって発話中であるか */
var isSpeaking = false;
/** 読み子を再生する */
var playYomiko = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // log.info('[playYomiko] start');
                isSpeaking = true;
                // 読み子呼び出し
                switch (config.typeYomiko) {
                    case 'tamiyasu': {
                        console.log(config.tamiyasuPath + " \"" + msg + "\"");
                        child_process_1.spawn(config.tamiyasuPath, [msg]);
                        break;
                    }
                    case 'bouyomi': {
                        if (bouyomi)
                            bouyomi.speak(msg);
                        break;
                    }
                }
                // 読み子が読んでる時間分相当待つ
                globalThis.electron.mainWindow.webContents.send(const_1.electronEvent['wait-yomiko-time'], msg);
                _a.label = 1;
            case 1:
                if (!isSpeaking) return [3 /*break*/, 3];
                return [4 /*yield*/, util_1.sleep(50)];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}); };
electron_1.ipcMain.on(const_1.electronEvent['speaking-end'], function (event) { return (isSpeaking = false); });
var isPlayingSe = false;
var playSe = function () { return __awaiter(void 0, void 0, void 0, function () {
    var wavfilepath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                wavfilepath = globalThis.electron.seList[Math.floor(Math.random() * globalThis.electron.seList.length)];
                isPlayingSe = true;
                globalThis.electron.mainWindow.webContents.send(const_1.electronEvent['play-sound-start'], wavfilepath);
                _a.label = 1;
            case 1:
                if (!isPlayingSe) return [3 /*break*/, 3];
                return [4 /*yield*/, util_1.sleep(50)];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}); };
electron_1.ipcMain.on(const_1.electronEvent['play-sound-end'], function (event) { return (isPlayingSe = false); });
exports.createDom = function (message) {
    var domStr = "<li class=\"list-item\">";
    /** レス番とかの行が何かしら表示対象になっているか */
    var isResNameShowed = false;
    // アイコン表示
    if (globalThis.config.showIcon) {
        domStr += "\n    <span class=\"icon-block\">\n      <img class=\"icon\" src=\"" + message.imgUrl + "\">\n    </span>\n    ";
        isResNameShowed = true;
    }
    domStr += "<div class=\"content\">";
    // レス番表示
    if (globalThis.config.showNumber && message.number) {
        domStr += "\n      <span class=\"resNumber\">" + message.number + "</span>\n    ";
        isResNameShowed = true;
    }
    // 名前表示
    if (globalThis.config.showName && message.name) {
        domStr += "<span class=\"name\">" + message.name + "</span>";
        isResNameShowed = true;
    }
    // 時刻表示
    if (globalThis.config.showTime && message.date) {
        domStr += "<span class=\"date\">" + message.date + "</span>";
        isResNameShowed = true;
    }
    // 名前と本文を改行で分ける
    // 名前や時刻の行が一つも無ければ、改行しない
    if (globalThis.config.newLine && isResNameShowed) {
        domStr += '<br />';
    }
    domStr += "\n    <span class=\"res\">\n      " + message.text
        .replace(/<a .*?>/g, '') // したらばはアンカーをaタグ化している
        .replace(/<\\a>/g, '') + "\n    </span>\n    </div>\n  </li>";
    return domStr;
};
/**
 * コメントのDOMをブラウザに送る
 * 必要ならレス着信音も鳴らす
 * @param message
 */
var sendDom = function (messageList) { return __awaiter(void 0, void 0, void 0, function () {
    var domStr, socketObject_1, text, MIN_DISP_TIME, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                domStr = messageList.map(function (message) { return exports.createDom(message); }).join('\n');
                socketObject_1 = {
                    type: 'add',
                    message: domStr,
                };
                aWss.clients.forEach(function (client) {
                    client.send(JSON.stringify(socketObject_1));
                });
                // レンダラーのコメント一覧にも表示
                sendDomForChatWindow(messageList);
                if (!(config.playSe && globalThis.electron.seList.length > 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, playSe()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!(globalThis.config.typeYomiko !== 'none')) return [3 /*break*/, 4];
                text = messageList[messageList.length - 1].text.replace(/<br> /g, '\n ').replace(/<br>/g, '\n ');
                text = text.replace(/<img.*?\/>/g, '');
                text = text.replace(/<a .*?>/g, '').replace(/<\/a>/g, '');
                text = util_1.unescapeHtml(text);
                return [4 /*yield*/, playYomiko(text)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                if (!(globalThis.config.dispType === 1)) return [3 /*break*/, 6];
                MIN_DISP_TIME = 2.5 * 1000;
                return [4 /*yield*/, util_1.sleep(MIN_DISP_TIME)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                // 鳴らし終わって読み子が終わった
                resetInitMessage();
                return [3 /*break*/, 8];
            case 7:
                e_3 = _a.sent();
                electron_log_1.default.error(e_3);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
var sendDomForChatWindow = function (messageList) {
    var domStr2 = messageList
        .map(function (message) {
        var imgUrl = message.imgUrl && message.imgUrl.match(/^\./) ? '../../public/' + message.imgUrl : message.imgUrl;
        return __assign(__assign({}, message), { imgUrl: imgUrl });
    })
        .map(function (message) { return exports.createDom(message); })
        .join('\n');
    globalThis.electron.chatWindow.webContents.send(const_1.electronEvent['show-comment'], { config: globalThis.config, dom: domStr2 });
};
var resetInitMessage = function () {
    if (globalThis.config.dispType === 1) {
        var resetObj_1 = {
            type: 'reset',
            message: globalThis.config.initMessage,
        };
        aWss.clients.forEach(function (client) {
            client.send(JSON.stringify(resetObj_1));
        });
    }
};
exports.default = {};


/***/ }),

/***/ "./src/main/util.ts":
/*!**************************!*\
  !*** ./src/main/util.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(__webpack_require__(/*! fs */ "fs"));
exports.readWavFiles = function (path) {
    return new Promise(function (resolve, reject) {
        fs_1.default.readdir(path, function (err, files) {
            if (err)
                reject(err);
            var fileList = files.filter(function (file) {
                return isExistFile(path + '/' + file) && /.*\.wav$/.test(file); //絞り込み
            });
            resolve(fileList);
        });
    });
};
var isExistFile = function (file) {
    try {
        fs_1.default.statSync(file).isFile();
        return true;
    }
    catch (err) {
        if (err.code === 'ENOENT')
            return false;
    }
};
exports.sleep = function (msec) { return new Promise(function (resolve) { return setTimeout(resolve, msec); }); };
exports.escapeHtml = function (string) {
    if (typeof string !== 'string') {
        return string;
    }
    return string.replace(/[&'`"<>]/g, function (match) {
        return {
            '&': '&amp;',
            "'": '&#x27;',
            '`': '&#x60;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
        }[match];
    });
};
exports.unescapeHtml = function (str) {
    return str
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&#044;/g, ',')
        .replace(/&amp;/g, '&');
};


/***/ }),

/***/ "./src/main/youtube-chat/index.ts":
/*!****************************************!*\
  !*** ./src/main/youtube-chat/index.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var live_chat_1 = __webpack_require__(/*! ./live-chat */ "./src/main/youtube-chat/live-chat.ts");
exports.LiveChat = live_chat_1.LiveChat;


/***/ }),

/***/ "./src/main/youtube-chat/live-chat.ts":
/*!********************************************!*\
  !*** ./src/main/youtube-chat/live-chat.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __webpack_require__(/*! events */ "events");
var axios_1 = __importDefault(__webpack_require__(/*! axios */ "axios"));
var parser_1 = __webpack_require__(/*! ./parser */ "./src/main/youtube-chat/parser.ts");
/**
 * YouTubeライブチャット取得イベント
 */
var LiveChat = /** @class */ (function (_super) {
    __extends(LiveChat, _super);
    function LiveChat(options, interval) {
        if (interval === void 0) { interval = 1000; }
        var _this = _super.call(this) || this;
        _this.interval = interval;
        _this.prevTime = Date.now();
        if ('channelId' in options) {
            _this.channelId = options.channelId;
        }
        else if ('liveId' in options) {
            _this.liveId = options.liveId;
        }
        else {
            throw TypeError('Required channelId or liveId.');
        }
        return _this;
    }
    LiveChat.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, liveRes, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.channelId) return [3 /*break*/, 4];
                        url = "https://www.youtube.com/channel/" + this.channelId + "/live";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get(url, { headers: LiveChat.headers })];
                    case 2:
                        liveRes = _a.sent();
                        //   if (liveRes.data.match(/LIVE_STREAM_OFFLINE/)) {
                        //     this.emit('error', new Error('Live stream offline'));
                        //     return false;
                        //   }
                        this.liveId = liveRes.data.match(/videoId\\":\\"(.+?)\\/)[1];
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.emit('error', new Error("connection error url = " + url));
                        return [2 /*return*/, false];
                    case 4:
                        if (!this.liveId) {
                            this.emit('error', new Error('Live stream not found'));
                            return [2 /*return*/, false];
                        }
                        // console.log(`liveId = ${this.liveId}`);
                        this.observer = setInterval(function () { return _this.fetchChat(); }, this.interval);
                        this.emit('start', this.liveId);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    LiveChat.prototype.stop = function (reason) {
        if (this.observer) {
            clearInterval(this.observer);
            this.emit('end', reason);
        }
    };
    LiveChat.prototype.fetchChat = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, res, items, item, e_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "https://www.youtube.com/live_chat?v=" + this.liveId + "&pbj=1";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get(url, { headers: LiveChat.headers })];
                    case 2:
                        res = _a.sent();
                        items = res.data[1].response.contents.liveChatRenderer.actions
                            .slice(0, -1)
                            .filter(function (v) {
                            var messageRenderer = parser_1.actionToRenderer(v);
                            if (messageRenderer !== null) {
                                if (messageRenderer) {
                                    return parser_1.usecToTime(messageRenderer.timestampUsec) > _this.prevTime;
                                }
                            }
                            return false;
                        })
                            .map(function (v) { return parser_1.parseData(v); });
                        items.forEach(function (v) {
                            if (v) {
                                _this.emit('comment', v);
                            }
                        });
                        if (items.length > 0) {
                            console.log("[Youtube-chat] items = " + items.length);
                            item = items[items.length - 1];
                            if (item)
                                this.prevTime = item.timestamp;
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        this.emit('error', new Error("Error occured at fetchchat url=" + url));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LiveChat.prototype.on = function (event, listener) {
        return _super.prototype.on.call(this, event, listener);
    };
    LiveChat.headers = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36' };
    return LiveChat;
}(events_1.EventEmitter));
exports.LiveChat = LiveChat;


/***/ }),

/***/ "./src/main/youtube-chat/parser.ts":
/*!*****************************************!*\
  !*** ./src/main/youtube-chat/parser.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var parseThumbnailToImageItem = function (data, alt) {
    var thumbnail = data.pop();
    if (thumbnail) {
        return {
            url: thumbnail.url,
            width: thumbnail.width,
            height: thumbnail.height,
            alt: alt,
        };
    }
    return;
};
var parseEmojiToImageItem = function (data) {
    return parseThumbnailToImageItem(data.emoji.image.thumbnails, data.emoji.shortcuts.shift());
};
var parseMessages = function (runs) {
    return runs.map(function (run) {
        if ('text' in run) {
            return run;
        }
        else {
            return parseEmojiToImageItem(run);
        }
    });
};
exports.actionToRenderer = function (action) {
    if (!action.addChatItemAction) {
        return null;
    }
    var item = action.addChatItemAction.item;
    if (item.liveChatTextMessageRenderer) {
        return item.liveChatTextMessageRenderer;
    }
    else if (item.liveChatPaidMessageRenderer) {
        return item.liveChatPaidMessageRenderer;
    }
    else if (item.liveChatPaidStickerRenderer) {
        return item.liveChatPaidStickerRenderer;
    }
    else {
        return item.liveChatMembershipItemRenderer;
    }
};
exports.usecToTime = function (usec) {
    return Math.floor(Number(usec) / 1000);
};
exports.parseData = function (data) {
    var messageRenderer = exports.actionToRenderer(data);
    if (messageRenderer === null) {
        return null;
    }
    var message = [];
    if ('message' in messageRenderer) {
        message = messageRenderer.message.runs;
    }
    else if ('headerSubtext' in messageRenderer) {
        message = messageRenderer.headerSubtext.runs;
    }
    var ret = {
        id: messageRenderer.id,
        author: {
            name: messageRenderer.authorName.simpleText,
            thumbnail: parseThumbnailToImageItem(messageRenderer.authorPhoto.thumbnails, messageRenderer.authorName.simpleText),
            channelId: messageRenderer.authorExternalChannelId,
        },
        message: parseMessages(message),
        membership: Boolean('headerSubtext' in messageRenderer),
        isOwner: false,
        timestamp: exports.usecToTime(messageRenderer.timestampUsec),
    };
    if (messageRenderer.authorBadges) {
        var badge = messageRenderer.authorBadges[0].liveChatAuthorBadgeRenderer;
        if (badge.customThumbnail) {
            ret.author.badge = {
                thumbnail: parseThumbnailToImageItem(badge.customThumbnail.thumbnails, badge.tooltip),
                label: badge.tooltip,
            };
        }
        else {
            ret.isOwner = true;
        }
    }
    if ('sticker' in messageRenderer) {
        ret.superchat = {
            amount: messageRenderer.purchaseAmountText.simpleText,
            color: messageRenderer.backgroundColor,
            sticker: parseThumbnailToImageItem(messageRenderer.sticker.thumbnails, messageRenderer.sticker.accessibility.accessibilityData.label),
        };
    }
    else if ('purchaseAmountText' in messageRenderer) {
        ret.superchat = {
            amount: messageRenderer.purchaseAmountText.simpleText,
            color: messageRenderer.bodyBackgroundColor,
        };
    }
    return ret;
};


/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("axios");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),

/***/ "dank-twitch-irc":
/*!**********************************!*\
  !*** external "dank-twitch-irc" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dank-twitch-irc");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ "electron-log":
/*!*******************************!*\
  !*** external "electron-log" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron-log");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-ws":
/*!*****************************!*\
  !*** external "express-ws" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express-ws");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "iconv-lite":
/*!*****************************!*\
  !*** external "iconv-lite" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("iconv-lite");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("net");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map