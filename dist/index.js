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
                // 末尾のレス番号を保存
                if (result.length > 0 && result[result.length - 1].number) {
                    globalThis.electron.threadNumber = Number(result[result.length - 1].number);
                }
                else {
                    // 読み込み失敗時はとりあえず指定されたレス番か1にする
                    globalThis.electron.threadNumber = resNum ? resNum : 1;
                }
                // 初回なのでキューを初期化
                // サーバー立てるとこで初期化してる
                // globalThis.electron.commentQueueList = [];
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
 * @param resNum この番号以降を取得する
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
        socket: null,
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
            var rep, requestUrl, range, options, responseJson, response, headers, str, error_1;
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
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default(options)];
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
            var requestUrl, options, response, str, responseJson;
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
                        };
                        return [4 /*yield*/, axios_1.default(options)];
                    case 1:
                        response = _a.sent();
                        str = iconv_lite_1.default.decode(Buffer.from(response.data), 'EUC-JP');
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
/**
 * サーバー起動
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
    var id;
    return __generator(this, function (_a) {
        globalThis.electron.chatWindow.webContents.send(const_1.electronEvent['clear-comment']);
        globalThis.electron.threadNumber = 0;
        globalThis.electron.commentQueueList = [];
        globalThis.electron.threadConnectionError = 0;
        app = express_ws_1.default(express_1.default()).app;
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
        id = new Date().getTime();
        app.get('/id', function (req, res, next) {
            res.send("" + id);
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
        getResInterval();
        // キュー処理の開始
        isExecuteQue = true;
        taskScheduler();
        // WebSocketを立てる
        app.ws('/ws', function (ws, req) {
            globalThis.electron.socket = ws;
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
                var imgUrl = './img/twitch.png';
                var name = msg.displayName;
                var text = msg.messageText;
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
                console.log('[Youtube Chat] connect started');
                globalThis.electron.youtubeChat = new youtube_chat_1.LiveChat({ channelId: globalThis.config.youtubeId });
                // 接続開始イベント
                globalThis.electron.youtubeChat.on('start', function (liveId) {
                    console.log("[Youtube Chat] connected liveId = " + liveId);
                });
                // 接続終了イベント
                globalThis.electron.youtubeChat.on('end', function (reason) {
                    console.log('[Youtube Chat] disconnect');
                });
                // チャット受信
                globalThis.electron.youtubeChat.on('comment', function (comment) {
                    var _a, _b;
                    electron_log_1.default.info('[Youtube] received');
                    var imgUrl = (_b = (_a = comment.author.thumbnail) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : '';
                    var name = comment.author.name;
                    var text = comment.message[0].text;
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
var getResInterval = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(globalThis.electron.threadNumber > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, getRes_1.getRes(globalThis.config.url, globalThis.electron.threadNumber)];
            case 1:
                result = _b.sent();
                // 指定したレス番は除外対象
                result.shift();
                if (result.length > 0 && result[result.length - 1].number) {
                    globalThis.electron.threadNumber = Number(result[result.length - 1].number);
                    (_a = globalThis.electron.commentQueueList).push.apply(_a, result);
                }
                return [4 /*yield*/, notifyThreadResLimit()];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                if (!threadIntervalEvent) return [3 /*break*/, 5];
                return [4 /*yield*/, util_1.sleep(globalThis.config.interval * 1000)];
            case 4:
                _b.sent();
                getResInterval();
                _b.label = 5;
            case 5: return [2 /*return*/];
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
                // 次スレ検索ポーリング処理を走らせる
                // スレ立て中だと思うのでちょっと待つ
                return [4 /*yield*/, util_1.sleep(10 * 1000)];
            case 1:
                // 次スレ検索ポーリング処理を走らせる
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
var taskScheduler = function () { return __awaiter(void 0, void 0, void 0, function () {
    var temp, comment;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!(((_b = (_a = globalThis.electron) === null || _a === void 0 ? void 0 : _a.commentQueueList) === null || _b === void 0 ? void 0 : _b.length) > 0)) return [3 /*break*/, 3];
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
                _c.sent();
                _c.label = 3;
            case 3:
                if (!isExecuteQue) return [3 /*break*/, 5];
                return [4 /*yield*/, util_1.sleep(100)];
            case 4:
                _c.sent();
                taskScheduler();
                _c.label = 5;
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
                        child_process_1.exec(config.tamiyasuPath + " " + msg);
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
    var domStr = "\n  <li class=\"list-item\">\n    <span class=\"icon-block\">\n      <img class=\"icon\" src=\"" + message.imgUrl + "\">\n    </span>\n  <div class=\"content\">";
    var isResNameShowed = false;
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
    domStr += "\n    <span class=\"res\">\n      " + message.text + "\n    </span>\n    </div>\n  </li>";
    return domStr;
};
/**
 * コメントのDOMをブラウザに送る
 * 必要ならレス着信音も鳴らす
 * @param message
 */
var sendDom = function (messageList) { return __awaiter(void 0, void 0, void 0, function () {
    var domStr, domStr2, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                domStr = messageList.map(function (message) { return exports.createDom(message); }).join('\n');
                if (globalThis.electron.socket)
                    globalThis.electron.socket.send(domStr);
                domStr2 = messageList
                    .map(function (message) {
                    var imgUrl = message.imgUrl && message.imgUrl.match(/^\./) ? '../../public/' + message.imgUrl : message.imgUrl;
                    return __assign(__assign({}, message), { imgUrl: imgUrl });
                })
                    .map(function (message) { return exports.createDom(message); })
                    .join('\n');
                globalThis.electron.chatWindow.webContents.send(const_1.electronEvent['show-comment'], { config: globalThis.config, dom: domStr2 });
                if (!(config.playSe && globalThis.electron.seList.length > 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, playSe()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!(globalThis.config.typeYomiko !== 'none')) return [3 /*break*/, 4];
                return [4 /*yield*/, playYomiko(messageList[messageList.length - 1].text)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                e_3 = _a.sent();
                electron_log_1.default.error(e_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4vUmVhZEljb25zLnRzIiwid2VicGFjazovLy8uL3NyYy9tYWluL2JvdXlvbWktY2hhbi9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9jb25zdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9nZXRSZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4vbWFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9yZWFkQkJTL1JlYWQ1Y2gudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4vcmVhZEJCUy9yZWFkU2l0YXJhYmEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4vc3RhcnRTZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4vdXRpbC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi95b3V0dWJlLWNoYXQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4veW91dHViZS1jaGF0L2xpdmUtY2hhdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi95b3V0dWJlLWNoYXQvcGFyc2VyLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcImF4aW9zXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYm9keS1wYXJzZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjaGlsZF9wcm9jZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZGFuay10d2l0Y2gtaXJjXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi1sb2dcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJldmVudHNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJleHByZXNzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzcy13c1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaWNvbnYtbGl0ZVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm5ldFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInBhdGhcIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZhO0FBQ2I7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixtQkFBTyxDQUFDLGNBQUk7QUFDdkMsNkJBQTZCLG1CQUFPLENBQUMsa0JBQU07QUFDM0MscUNBQXFDLG1CQUFPLENBQUMsa0NBQWM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLEVBQUU7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDLEVBQUU7QUFDSDtBQUNBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMsRUFBRTtBQUNIO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxFQUFFO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMsRUFBRTtBQUNILCtF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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEdBLGtDOzs7Ozs7Ozs7OztBQ0FBLHdDOzs7Ozs7Ozs7OztBQ0FBLDBDOzs7Ozs7Ozs7OztBQ0FBLDRDOzs7Ozs7Ozs7OztBQ0FBLHFDOzs7Ozs7Ozs7OztBQ0FBLHlDOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLHVDOzs7Ozs7Ozs7OztBQ0FBLCtCOzs7Ozs7Ozs7OztBQ0FBLHVDOzs7Ozs7Ozs7OztBQ0FBLGdDOzs7Ozs7Ozs7OztBQ0FBLGlDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvbWFpbi9tYWluLnRzXCIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuLyoqXHJcbiAqIOOCouOCpOOCs+ODs+ihqOekuuOBq+mWouOBmeOCi+ODouOCuOODpeODvOODq1xyXG4gKiDjgrfjg7PjgrDjg6vjg4jjg7NcclxuICovXHJcbnZhciBmc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJmc1wiKSk7XHJcbnZhciBwYXRoXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcInBhdGhcIikpO1xyXG52YXIgZWxlY3Ryb25fbG9nXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImVsZWN0cm9uLWxvZ1wiKSk7XHJcbnZhciByYW5kb21JY29uTGlzdDtcclxudmFyIGlkSWNvbkxpc3Q7XHJcbi8qKlxyXG4gKiDjgrPjg7Pjgrnjg4jjg6njgq/jgr9cclxuICog44O744Op44Oz44OA44Og44OV44Kp44Or44OA44GL44KJ44Ki44Kk44Kz44Oz5ZCN44KS5Y+W5b6X44GX44Gm44Oq44K544OI5YyWXHJcbiAqIOODu0lE44OV44Kp44Or44OA44GL44KJ44KC44Oq44K544OI5YyW44CB56m644Gu5a++5b+c44Oe44OD44OX5L2c6KO9XHJcbiAqIOODu+OCs+ODhuODj+ODs+WvvuW/nOODleOCoeOCpOODq+OCkuiqreOBv+OBk+OCk+OBp21hcOOBq+agvOe0jVxyXG4gKi9cclxudmFyIFJlYWRJY29ucyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFJlYWRJY29ucygpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqLjgqTjgrPjg7Pjg6njg7Pjg4Djg6DooajnpLrmqZ/og73vvIjjg4fjg5Xjgqnjg6vjg4jvvIlcclxuICAgICAgICAgKiDotbfli5XmmYLjgavkvZzmiJDjgZfjgZ/jgqLjgqTjgrPjg7Pjg6rjgrnjg4jjgYvjgonjg6njg7Pjg4Djg6Djgacx44Gk5Y+W5b6XXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5nZXRSYW5kb21JY29ucyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGljb25QYXRoID0gJyc7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGlyTmFtZSA9ICcuL2ltZy9yYW5kb20vJztcclxuICAgICAgICAgICAgICAgIC8vIOODquOCueODiOOBi+OCieODqeODs+ODgOODoOWPluW+l1xyXG4gICAgICAgICAgICAgICAgLy8gIGNvbnN0IHNpemUgPSByYW5kb21JY29uTGlzdC5zaXplO1xyXG4gICAgICAgICAgICAgICAgdmFyIG51bSA9IE1hdGguZmxvb3IocmFuZG9tSWNvbkxpc3QubGVuZ3RoICogTWF0aC5yYW5kb20oKSk7XHJcbiAgICAgICAgICAgICAgICBpY29uUGF0aCA9IGRpck5hbWUgKyByYW5kb21JY29uTGlzdFtudW1dO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVjdHJvbl9sb2dfMS5kZWZhdWx0LmVycm9yKGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpY29uUGF0aDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8v55S75YOP44OH44Kj44Os44Kv44OI44OqXHJcbiAgICAgICAgdmFyIHJhbmRvbURpciA9IHBhdGhfMS5kZWZhdWx0LnJlc29sdmUoX19kaXJuYW1lLCBcIi4uL3B1YmxpYy9pbWcvcmFuZG9tL1wiKTtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKCdbUmVhZEljb25zXWxvYWRSYW5kb21EaXIgPSAnICsgcmFuZG9tRGlyKTtcclxuICAgICAgICAvLyAg44Op44Oz44OA44Og44Ki44Kk44Kz44Oz5Y+W5b6XXHJcbiAgICAgICAgcmFuZG9tSWNvbkxpc3QgPSByZWFkRGlyKHJhbmRvbURpcik7XHJcbiAgICAgICAgLy9JROeUqOOCouOCpOOCs+ODs+ODh+OCo+ODrOOCr+ODiOODqlxyXG4gICAgICAgIHZhciBpZERpciA9IHBhdGhfMS5kZWZhdWx0LnJlc29sdmUoX19kaXJuYW1lLCBcIi4uL3B1YmxpYy9pbWcvaWQvXCIpO1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ1tSZWFkSWNvbnNdbG9hZElERGlyID0gJyArIGlkRGlyKTtcclxuICAgICAgICAvLyAg44Op44Oz44OA44Og44Ki44Kk44Kz44Oz5Y+W5b6XXHJcbiAgICAgICAgaWRJY29uTGlzdCA9IHJlYWREaXIoaWREaXIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFJlYWRJY29ucztcclxufSgpKTtcclxudmFyIHJlYWREaXIgPSBmdW5jdGlvbiAoaW1nRGlyKSB7XHJcbiAgICB2YXIgaWNvbkZpbGVMaXN0ID0gW107XHJcbiAgICAvLyAg5oyH5a6a44GX44Gf44OH44Kj44Os44Kv44OI44Oq44Gu44Ki44Kk44Kz44Oz5Y+W5b6XXHJcbiAgICB2YXIgZmlsZXMgPSBmc18xLmRlZmF1bHQucmVhZGRpclN5bmMoaW1nRGlyLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XHJcbiAgICAvL3BuZ+ODleOCoeOCpOODq+OBruOBv+i/lOWNtOODquOCueODiOOBq+agvOe0jeOBmeOCi1xyXG4gICAgZmlsZXMuZm9yRWFjaChmdW5jdGlvbiAoZmlsZSkge1xyXG4gICAgICAgIC8vIGFzYXLlnKfnuK7jgZnjgovjgahmaWxl44GM5paH5a2X5YiX44Gr44Gq44KL44CC6ZaL55m655Kw5aKD44Gg44GoZmlsZeOCquODluOCuOOCp+OCr+ODiOOBq+OBquOCi1xyXG4gICAgICAgIHZhciB0YXJnZXQgPSB0eXBlb2YgZmlsZS5uYW1lICE9PSAnc3RyaW5nJyA/IGZpbGUgOiBmaWxlLm5hbWU7XHJcbiAgICAgICAgdmFyIHJlZ3ggPSAvLipcXC5wbmckLy50ZXN0KHRhcmdldCk7XHJcbiAgICAgICAgaWYgKHJlZ3gpIHtcclxuICAgICAgICAgICAgaWNvbkZpbGVMaXN0LnB1c2godGFyZ2V0KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdbUmVhZEljb25zLnJlYWREaXJdZW5kJyk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShpY29uRmlsZUxpc3QpKTtcclxuICAgIHJldHVybiBpY29uRmlsZUxpc3Q7XHJcbn07XHJcbi8qKlxyXG4gKiBJROOBq+OCiOOCi+OCouOCpOOCs+ODs+WbuuWumuapn+iDve+8iOOCquODl+OCt+ODp+ODs+OBp09OLE9GRuWPr+iDve+8iVxyXG4gKiDliJ3lh7rjga5JROOBquOCieOBsOODqeODs+ODgOODoOOBp+OCouOCpOOCs+ODs+OCkuWPluW+l+OBl1xyXG4gKiBJROOBqOODleOCoeOCpOODq+WQjeOBruOCu+ODg+ODiOOBp+ODnuODg+ODl+OBq+agvOe0jVxyXG4gKiBAcGFyYW0gc3RyaW5nIC8vIElEXHJcbiAqIEByZXR1cm4gc3RyaW5nIGZpbGVuYW1lXHJcbiAqL1xyXG4vKipcclxuICog44Kz44OG44OP44Oz44Oq44K544OI5qmf6IO977yI44Kq44OX44K344On44Oz44GnT04sT0ZG5Y+v6IO977yJXHJcbiAqIGtvdGXjg5Xjgqnjg6vjg4Djga7kuIvjgatrb3RlaGFuLmpzb27jgpLkvZzjgaPjgaZcclxuICog5ZCN5YmN44Go44Ki44Kk44Kz44Oz44OV44Kh44Kk44Or5ZCN44Gu5a++5b+c44KS44Oe44OD44OX44Gr44GX44Gm6L+U44GZ44Gg44GRXHJcbiAqL1xyXG5leHBvcnRzLmRlZmF1bHQgPSBSZWFkSWNvbnM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBuZXRfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwibmV0XCIpKTtcclxudmFyIEJvdXlvbWlDaGFuID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gQm91eW9taUNoYW4ob3B0aW9ucykge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOajkuiqreOBv+OBoeOCg+OCk+OBruODm+OCueODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuaG9zdCA9ICdsb2NhbGhvc3QnO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOajkuiqreOBv+OBoeOCg+OCk+OBruODneODvOODiOeVquWPt1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMucG9ydCA9IDUwMDAxO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOmAn+W6pu+8iC0xOuajkuiqreOBv+OBoeOCg+OCk+eUu+mdouS4iuOBruioreWumu+8iVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuc3BlZWQgPSAtMTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDpn7PnqIvvvIgtMTrmo5Loqq3jgb/jgaHjgoPjgpPnlLvpnaLkuIrjga7oqK3lrprvvIlcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnRvbmUgPSAtMTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDpn7Pph4/vvIgtMTrmo5Loqq3jgb/jgaHjgoPjgpPnlLvpnaLkuIrjga7oqK3lrprvvIlcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnZvbHVtZSA9IC0xO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWjsOizqu+8iCAwOuajkuiqreOBv+OBoeOCg+OCk+eUu+mdouS4iuOBruioreWumuOAgTE65aWz5oCnMeOAgTI65aWz5oCnMuOAgTM655S35oCnMeOAgTQ655S35oCnMuOAgTU65Lit5oCn44CBNjrjg63jg5zjg4Pjg4jjgIE3Ouapn+aisDHjgIE4Ouapn+aisDLjgIExMDAwMe+9njpTQVBJNe+8iVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudHlwZSA9IDA7XHJcbiAgICAgICAgaWYgKCFvcHRpb25zKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgaWYgKG9wdGlvbnMuaG9zdClcclxuICAgICAgICAgICAgdGhpcy5ob3N0ID0gb3B0aW9ucy5ob3N0O1xyXG4gICAgICAgIGlmIChvcHRpb25zLnBvcnQpXHJcbiAgICAgICAgICAgIHRoaXMucG9ydCA9IG9wdGlvbnMucG9ydDtcclxuICAgICAgICBpZiAob3B0aW9ucy5zcGVlZClcclxuICAgICAgICAgICAgdGhpcy5zcGVlZCA9IG9wdGlvbnMuc3BlZWQ7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMudG9uZSlcclxuICAgICAgICAgICAgdGhpcy50b25lID0gb3B0aW9ucy50b25lO1xyXG4gICAgICAgIGlmIChvcHRpb25zLnZvbHVtZSlcclxuICAgICAgICAgICAgdGhpcy52b2x1bWUgPSBvcHRpb25zLnZvbHVtZTtcclxuICAgICAgICBpZiAob3B0aW9ucy50eXBlKVxyXG4gICAgICAgICAgICB0aGlzLnR5cGUgPSBvcHRpb25zLnR5cGU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIOajkuiqreOBv+OBoeOCg+OCk+OBq+iqreOBv+S4iuOBkuOBpuOCguOCieOBhuaWh+eroFxyXG4gICAgICovXHJcbiAgICBCb3V5b21pQ2hhbi5wcm90b3R5cGUuc3BlYWsgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xyXG4gICAgICAgIC8qKiDmo5Loqq3jgb/jgaHjgoPjgpPjgavpgIHkv6HjgZnjgovoqK3lrprjga7jg5DjgqTjg4jplbcgKi9cclxuICAgICAgICB2YXIgU0VUVElOR1NfQllURVNfTEVOR1RIID0gMTU7XHJcbiAgICAgICAgdmFyIG1lc3NhZ2VCeXRlTGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgobWVzc2FnZSk7XHJcbiAgICAgICAgdmFyIGJ1ZmZlckxlbmd0aCA9IFNFVFRJTkdTX0JZVEVTX0xFTkdUSCArIG1lc3NhZ2VCeXRlTGVuZ3RoO1xyXG4gICAgICAgIHZhciBidWZmID0gQnVmZmVyLmFsbG9jKGJ1ZmZlckxlbmd0aCk7XHJcbiAgICAgICAgLyoqIOODoeODg+OCu+ODvOOCuOiqreOBv+S4iuOBkuOCs+ODnuODs+ODiSAqL1xyXG4gICAgICAgIHZhciBDT01NQU5EX1RPX1NQRUFLID0gMTtcclxuICAgICAgICB2YXIgbGVuID0gYnVmZi53cml0ZVVJbnQxNkxFKENPTU1BTkRfVE9fU1BFQUspO1xyXG4gICAgICAgIGxlbiA9IGJ1ZmYud3JpdGVJbnQxNkxFKHRoaXMuc3BlZWQsIGxlbik7XHJcbiAgICAgICAgbGVuID0gYnVmZi53cml0ZUludDE2TEUodGhpcy50b25lLCBsZW4pO1xyXG4gICAgICAgIGxlbiA9IGJ1ZmYud3JpdGVJbnQxNkxFKHRoaXMudm9sdW1lLCBsZW4pO1xyXG4gICAgICAgIGxlbiA9IGJ1ZmYud3JpdGVVSW50MTZMRSh0aGlzLnR5cGUsIGxlbik7XHJcbiAgICAgICAgLyoqIOaWh+Wtl+OCs+ODvOODiSgwOlVURi04LCAxOlVuaWNvZGUsIDI6U2hpZnQtSklTKSAqL1xyXG4gICAgICAgIHZhciBFTkNPRElORyA9IDA7XHJcbiAgICAgICAgbGVuID0gYnVmZi53cml0ZVVJbnQ4KEVOQ09ESU5HLCBsZW4pO1xyXG4gICAgICAgIGxlbiA9IGJ1ZmYud3JpdGVVSW50MzJMRShtZXNzYWdlQnl0ZUxlbmd0aCwgbGVuKTtcclxuICAgICAgICBsZW4gPSBidWZmLndyaXRlKG1lc3NhZ2UsIGxlbik7XHJcbiAgICAgICAgdmFyIGNsaWVudCA9IG5ldF8xLmRlZmF1bHQuY3JlYXRlQ29ubmVjdGlvbih0aGlzLnBvcnQsIHRoaXMuaG9zdCk7XHJcbiAgICAgICAgY2xpZW50LndyaXRlKGJ1ZmYpO1xyXG4gICAgICAgIGNsaWVudC5lbmQoKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gQm91eW9taUNoYW47XHJcbn0oKSk7XHJcbmV4cG9ydHMuZGVmYXVsdCA9IEJvdXlvbWlDaGFuO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmVsZWN0cm9uRXZlbnQgPSB7XHJcbiAgICAvKiog44K144O844OQ44O86LW35YuVICovXHJcbiAgICAnc3RhcnQtc2VydmVyJzogJ3N0YXJ0LXNlcnZlcicsXHJcbiAgICAvKiog44K144O844OQ44O85YGc5q2iICovXHJcbiAgICAnc3RvcC1zZXJ2ZXInOiAnc3RvcC1zZXJ2ZXInLFxyXG4gICAgLyoqIENvbmZpZ+mBqeeUqCAqL1xyXG4gICAgJ2FwcGx5LWNvbmZpZyc6ICdhcHBseS1jb25maWcnLFxyXG4gICAgLyoqIOOCouODqeODvOODiOihqOekuiAqL1xyXG4gICAgJ3Nob3ctYWxlcnQnOiAnc2hvdy1hbGVydCcsXHJcbiAgICAvKiog5qOS6Kqt44G/5YaN55SfICovXHJcbiAgICAncGxheS10YW1peWFzdSc6ICdwbGF5LXRhbWl5YXN1JyxcclxuICAgIC8qKiDjg6zjgrnnnYDkv6Hpn7Plho3nlJ8gKi9cclxuICAgICdwbGF5LXNvdW5kLXN0YXJ0JzogJ3BsYXktc291bmQtc3RhcnQnLFxyXG4gICAgJ3BsYXktc291bmQtZW5kJzogJ3BsYXktc291bmQtZW5kJyxcclxuICAgICd3YWl0LXlvbWlrby10aW1lJzogJ3dhaXQteW9taWtvLXRpbWUnLFxyXG4gICAgJ3NwZWFraW5nLWVuZCc6ICdzcGVha2luZy1lbmQnLFxyXG4gICAgLyoqIOOCs+ODoeODs+ODiOihqOekuiAqL1xyXG4gICAgJ3Nob3ctY29tbWVudCc6ICdzaG93LWNvbW1lbnQnLFxyXG4gICAgLyoqIOOCs+ODoeODs+ODiOashOWIneacn+WMliAqL1xyXG4gICAgJ2NsZWFyLWNvbW1lbnQnOiAnY2xlYXItY29tbWVudCcsXHJcbiAgICAvKiog44K144O844OQ44O86LW35YuV44Gu6L+U5L+hICovXHJcbiAgICAnc3RhcnQtc2VydmVyLXJlcGx5JzogJ3N0YXJ0LXNlcnZlci1yZXBseScsXHJcbn07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXHJcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59O1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBleHByZXNzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImV4cHJlc3NcIikpO1xyXG52YXIgYm9keV9wYXJzZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYm9keS1wYXJzZXJcIikpOyAvLyBqc29u44OR44O844K1XHJcbnZhciByb3V0ZXIgPSBleHByZXNzXzEuZGVmYXVsdC5Sb3V0ZXIoKTtcclxudmFyIGVsZWN0cm9uX2xvZ18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJlbGVjdHJvbi1sb2dcIikpO1xyXG52YXIgUmVhZEljb25zXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vUmVhZEljb25zXCIpKTsgLy/jgqLjgqTjgrPjg7Pjg5XjgqHjgqTjg6vlkI3lj5blvpdcclxudmFyIHJlYWRJY29ucyA9IG5ldyBSZWFkSWNvbnNfMS5kZWZhdWx0KCk7XHJcbnZhciBzdGFydFNlcnZlcl8xID0gcmVxdWlyZShcIi4vc3RhcnRTZXJ2ZXJcIik7XHJcbnZhciByZWFkU2l0YXJhYmFfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9yZWFkQkJTL3JlYWRTaXRhcmFiYVwiKSk7IC8vIOOBl+OBn+OCieOBsOiqreOBv+i+vOOBv+eUqOODouOCuOODpeODvOODq1xyXG52YXIgUmVhZDVjaF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL3JlYWRCQlMvUmVhZDVjaFwiKSk7IC8vIDVjaOS6kuaPm+adv+iqreOBv+i+vOOBv+eUqOODouOCuOODpeODvOODq1xyXG52YXIgc2l0YXJhYmEgPSBuZXcgcmVhZFNpdGFyYWJhXzEuZGVmYXVsdCgpO1xyXG52YXIgcmVhZDVjaCA9IG5ldyBSZWFkNWNoXzEuZGVmYXVsdCgpO1xyXG4vLyDmjrLnpLrmnb/oqq3jgb/ovrzjgb/jg6Ljgrjjg6Xjg7zjg6vjgIHkuIDluqbmsbrlrprjgZfjgZ/jgonkvb/jgYTjgb7jgo/jgZnjgZ/jgoHjgavjgrDjg63jg7zjg5Djg6vlrqPoqIBcclxudmFyIGJic01vZHVsZSA9IG51bGw7XHJcbi8vIOODquOCr+OCqOOCueODiOOBrmJvZHnjgpLjg5Hjg7zjgrnkuIvjgorjgqjjg7PjgrPjg7zjg4njgZfjgZ/jgorjgZnjgovjgZ/jgoHjga7jgoTjgaRcclxucm91dGVyLnVzZShib2R5X3BhcnNlcl8xLmRlZmF1bHQudXJsZW5jb2RlZCh7IGV4dGVuZGVkOiB0cnVlIH0pKTtcclxucm91dGVyLnVzZShib2R5X3BhcnNlcl8xLmRlZmF1bHQuanNvbigpKTtcclxuLyoqXHJcbiAqIOODluODqeOCpuOCtuOBi+OCieOBruWIneacn+WHpueQhuODquOCr+OCqOOCueODiFxyXG4gKi9cclxucm91dGVyLmdldCgnLycsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB0aHJlYWRVcmwsIHJlc051bSwgcmVzdWx0LCBkb21zO1xyXG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgdGhyZWFkVXJsID0gZ2xvYmFsVGhpcy5jb25maWcudXJsO1xyXG4gICAgICAgICAgICAgICAgcmVzTnVtID0gZ2xvYmFsVGhpcy5jb25maWcucmVzTnVtYmVyID8gTnVtYmVyKGdsb2JhbFRoaXMuY29uZmlnLnJlc051bWJlcikgOiBOYU47XHJcbiAgICAgICAgICAgICAgICByZXMuaGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgZXhwb3J0cy5nZXRSZXModGhyZWFkVXJsLCByZXNOdW0pXTtcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgLy8g5pyr5bC+44Gu44Os44K555Wq5Y+344KS5L+d5a2YXHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXS5udW1iZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLnRocmVhZE51bWJlciA9IE51bWJlcihyZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdLm51bWJlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDoqq3jgb/ovrzjgb/lpLHmlZfmmYLjga/jgajjgorjgYLjgYjjgZrmjIflrprjgZXjgozjgZ/jg6zjgrnnlarjgYsx44Gr44GZ44KLXHJcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsVGhpcy5lbGVjdHJvbi50aHJlYWROdW1iZXIgPSByZXNOdW0gPyByZXNOdW0gOiAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8g5Yid5Zue44Gq44Gu44Gn44Kt44Ol44O844KS5Yid5pyf5YyWXHJcbiAgICAgICAgICAgICAgICAvLyDjgrXjg7zjg5Djg7znq4vjgabjgovjgajjgZPjgafliJ3mnJ/ljJbjgZfjgabjgotcclxuICAgICAgICAgICAgICAgIC8vIGdsb2JhbFRoaXMuZWxlY3Ryb24uY29tbWVudFF1ZXVlTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBkb21zID0gcmVzdWx0Lm1hcChmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gc3RhcnRTZXJ2ZXJfMS5jcmVhdGVEb20oaXRlbSk7IH0pO1xyXG4gICAgICAgICAgICAgICAgcmVzLnNlbmQoSlNPTi5zdHJpbmdpZnkoZG9tcykpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KTsgfSk7XHJcbi8qKlxyXG4gKiDmjrLnpLrmnb/jga7jg6zjgrnjgpLlj5blvpfjgZnjgotcclxuICogQHBhcmFtIHRocmVhZFVybCDjgrnjg6zjga5VUkxcclxuICogQHBhcmFtIHJlc051bSDjgZPjga7nlarlj7fku6XpmY3jgpLlj5blvpfjgZnjgotcclxuICovXHJcbmV4cG9ydHMuZ2V0UmVzID0gZnVuY3Rpb24gKHRocmVhZFVybCwgcmVzTnVtKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHJlc3BvbnNlLCBlXzE7XHJcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzAsIDIsICwgM10pO1xyXG4gICAgICAgICAgICAgICAgLy8g44Oq44Kv44Ko44K544OIVVJM44KS6Kej5p6Q44GX44CB5L2/55So44GZ44KL44Oi44K444Ol44O844Or44KS5aSJ5pu044GZ44KLXHJcbiAgICAgICAgICAgICAgICBiYnNNb2R1bGUgPSBhbmFseXNCQlNOYW1lKHRocmVhZFVybCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBiYnNNb2R1bGUucmVhZCh0aHJlYWRVcmwsIHJlc051bSldO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgIGdsb2JhbFRoaXMuZWxlY3Ryb24udGhyZWFkQ29ubmVjdGlvbkVycm9yID0gMDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW2dldFJlcy5qc10gZmV0Y2ggXCIgKyB0aHJlYWRVcmwgKyBcIiByZXNOdW0gPSBcIiArIHJlc051bSArIFwiLCByZXN1bHQgPSBcIiArIHJlc3BvbnNlLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2UubWFwKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCByZXMpLCB7IGltZ1VybDogcmVhZEljb25zLmdldFJhbmRvbUljb25zKCkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSldO1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICBlXzEgPSBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICBlbGVjdHJvbl9sb2dfMS5kZWZhdWx0LmVycm9yKGVfMSk7XHJcbiAgICAgICAgICAgICAgICAvLyDjgqjjg6njg7zlm57mlbDjgYzopo/lrprlm57mlbDku6XkuIrjgYvjg4Hjgqfjg4Pjgq/jgZfjgabjgIHotoXjgYjjgabjgZ/jgonpgJrnn6XjgZnjgotcclxuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxUaGlzLmNvbmZpZy5ub3RpZnlUaHJlYWRDb25uZWN0aW9uRXJyb3JMaW1pdCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLnRocmVhZENvbm5lY3Rpb25FcnJvciArPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChnbG9iYWxUaGlzLmVsZWN0cm9uLnRocmVhZENvbm5lY3Rpb25FcnJvciA+PSBnbG9iYWxUaGlzLmNvbmZpZy5ub3RpZnlUaHJlYWRDb25uZWN0aW9uRXJyb3JMaW1pdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLnRocmVhZENvbm5lY3Rpb25FcnJvciA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAndW5hY2FzdOOCiOOCiicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltZ1VybDogJy4vaW1nL3VuYWNhc3QucG5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogJ+aOsuekuuadv+OBjOimj+WumuWbnuaVsOmAmuS/oeOCqOODqeODvOOBq+OBquOCiuOBvuOBl+OBn+OAguioreWumuOCkuimi+ebtOOBmeOBi+OAgeaOsuekuuadv1VSTOOCkuWkieabtOOBl+OBpuOBj+OBoOOBleOBhOOAgicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1dO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBbXV07XHJcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KTsgfTtcclxuLypcclxuICogVVJM44KS44G/44Gm44Gp44GT44GuQkJT44GL5Yik5a6a44GX44Gm5L2/55So44GZ44KL44Oi44K444Ol44O844Or44KS6L+U5Y2044GZ44KLXHJcbiAqL1xyXG52YXIgYW5hbHlzQkJTTmFtZSA9IGZ1bmN0aW9uICh0aHJlYWRVcmwpIHtcclxuICAgIC8vIOOBl+OBn+OCieOBsOODieODoeOCpOODs+WQjVxyXG4gICAgdmFyIHNpdGFyYWJhRG9tYWluID0gJ2piYnMuc2hpdGFyYWJhLm5ldCc7XHJcbiAgICAvLyDjgZPjgpPjgarmhJ/jgZjjgaflv4XopoHjgavlv5zjgZjjgablopfjgoTjgZfjgabjgYTjgZHjgbDjgYTjgYTjgpPjgZjjgoPjga3vvJ9cclxuICAgIC8vIGNvbnN0IGRva2thbm9CQlMgPSAnZG9ra2EuYmJzLmNvbSc7XHJcbiAgICBpZiAodGhyZWFkVXJsLmluZGV4T2Yoc2l0YXJhYmFEb21haW4pICE9PSAtMSkge1xyXG4gICAgICAgIC8vIFVSTOOBq+OBl+OBn+OCieOBsOODieODoeOCpOODs+WQjeOBjOWFpeOBo+OBpuOCjOOBsOOBl+OBn+OCieOBsFxyXG4gICAgICAgIHJldHVybiBzaXRhcmFiYTtcclxuICAgIH1cclxuICAgIC8vIOOBqeOBk+OBq+OCguipsuW9k+OBl+OBquOBi+OBo+OBn+OCieOBqOOCiuOBguOBiOOBmjVjaOOBp1xyXG4gICAgLy8g44GT44Gu6L6644KC5a++5b+c44OJ44Oh44Kk44Oz44Oq44K544OI44Go44GL5L2c44Gj44Gm44Gh44KD44KT44Go5Yik5a6a44GX44Gf44G744GG44GM44KI44GV44Gd44GGXHJcbiAgICByZXR1cm4gcmVhZDVjaDtcclxufTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gcm91dGVyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn07XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHRbXCJkZWZhdWx0XCJdID0gbW9kO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vLyBFbGVjdHJvbuOBruODouOCuOODpeODvOODq1xyXG52YXIgcGF0aF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJwYXRoXCIpKTtcclxudmFyIGVsZWN0cm9uXzEgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcImVsZWN0cm9uXCIpKTtcclxudmFyIGVsZWN0cm9uX2xvZ18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJlbGVjdHJvbi1sb2dcIikpO1xyXG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcclxuY29uc29sZS50cmFjZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vXHJcbn07XHJcbnByb2Nlc3Mub24oJ3VuY2F1Z2h0RXhjZXB0aW9uJywgZnVuY3Rpb24gKGVycikge1xyXG4gICAgZWxlY3Ryb25fbG9nXzEuZGVmYXVsdC5lcnJvcihlcnIpO1xyXG59KTtcclxuLy8g44Ki44OX44Oq44Kx44O844K344On44Oz44KS44Kz44Oz44OI44Ot44O844Or44GZ44KL44Oi44K444Ol44O844OrXHJcbnZhciBhcHAgPSBlbGVjdHJvbl8xLmRlZmF1bHQuYXBwO1xyXG4vLyDlpJrph43otbfli5XpmLLmraJcclxuaWYgKCFhcHAucmVxdWVzdFNpbmdsZUluc3RhbmNlTG9jaygpKSB7XHJcbiAgICBlbGVjdHJvbl9sb2dfMS5kZWZhdWx0LmVycm9yKCdbYXBwXSBJdCBpcyB0ZXJtaW5hdGVkIGZvciBtdWx0aXBsZSBsYXVuY2hlcy4nKTtcclxuICAgIGFwcC5xdWl0KCk7XHJcbn1cclxuZWxzZSB7XHJcbiAgICBlbGVjdHJvbl9sb2dfMS5kZWZhdWx0LmluZm8oJ1thcHBdIHN0YXJ0ZWQnKTtcclxuICAgIGFwcC5hbGxvd1JlbmRlcmVyUHJvY2Vzc1JldXNlID0gdHJ1ZTtcclxuICAgIHZhciBpY29uUGF0aF8xID0gcGF0aF8xLmRlZmF1bHQucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9pY29uLnBuZycpO1xyXG4gICAgLy8g44K144O844OQ44O86LW35YuV44Oi44K444Ol44O844OrXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXZhci1yZXF1aXJlc1xyXG4gICAgdmFyIHNzID0gcmVxdWlyZSgnLi9zdGFydFNlcnZlcicpO1xyXG4gICAgY29uc29sZS50cmFjZShzcyk7XHJcbiAgICAvLyDjgqbjgqPjg7Pjg4njgqbjgpLkvZzmiJDjgZnjgovjg6Ljgrjjg6Xjg7zjg6tcclxuICAgIHZhciBCcm93c2VyV2luZG93XzEgPSBlbGVjdHJvbl8xLmRlZmF1bHQuQnJvd3NlcldpbmRvdztcclxuICAgIC8vIOODoeOCpOODs+OCpuOCo+ODs+ODieOCpuOBr0dD44GV44KM44Gq44GE44KI44GG44Gr44Kw44Ot44O844OQ44Or5a6j6KiAXHJcbiAgICBnbG9iYWxUaGlzLmVsZWN0cm9uID0ge1xyXG4gICAgICAgIG1haW5XaW5kb3c6IG51bGwsXHJcbiAgICAgICAgY2hhdFdpbmRvdzogbnVsbCxcclxuICAgICAgICBzZUxpc3Q6IFtdLFxyXG4gICAgICAgIHR3aXRjaENoYXQ6IG51bGwsXHJcbiAgICAgICAgeW91dHViZUNoYXQ6IG51bGwsXHJcbiAgICAgICAgc29ja2V0OiBudWxsLFxyXG4gICAgICAgIHRocmVhZENvbm5lY3Rpb25FcnJvcjogMCxcclxuICAgICAgICB0aHJlYWROdW1iZXI6IDAsXHJcbiAgICAgICAgY29tbWVudFF1ZXVlTGlzdDogW10sXHJcbiAgICB9O1xyXG4gICAgZ2xvYmFsVGhpcy5jb25maWcgPSB7fTtcclxuICAgIC8vIOWFqOOBpuOBruOCpuOCo+ODs+ODieOCpuOBjOmWieOBmOOBn+OCiee1guS6hlxyXG4gICAgLy8gYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcclxuICAgIC8vICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT0gJ2RhcndpbicpIHtcclxuICAgIC8vICAgICBhcHAucXVpdCgpO1xyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9KTtcclxuICAgIC8vIEVsZWN0cm9u44Gu5Yid5pyf5YyW5a6M5LqG5b6M44Gr5a6f6KGMXHJcbiAgICBhcHAub24oJ3JlYWR5JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIOOCpuOCo+ODs+ODieOCpuOCteOCpOOCuuOCku+8iOODleODrOODvOODoOOCteOCpOOCuuOCkuWQq+OBvuOBquOBhO+8ieioreWumlxyXG4gICAgICAgIGdsb2JhbFRoaXMuZWxlY3Ryb24ubWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93XzEoe1xyXG4gICAgICAgICAgICB3aWR0aDogNzAwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDcyMCxcclxuICAgICAgICAgICAgdXNlQ29udGVudFNpemU6IHRydWUsXHJcbiAgICAgICAgICAgIGljb246IGljb25QYXRoXzEsXHJcbiAgICAgICAgICAgIHdlYlByZWZlcmVuY2VzOiB7XHJcbiAgICAgICAgICAgICAgICBub2RlSW50ZWdyYXRpb246IHRydWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNraXBUYXNrYmFyOiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGdsb2JhbFRoaXMuZWxlY3Ryb24ubWFpbldpbmRvdy5zZXRUaXRsZSgndW5hY2FzdCcpO1xyXG4gICAgICAgIGdsb2JhbFRoaXMuZWxlY3Ryb24ubWFpbldpbmRvdy5zZXRNZW51KG51bGwpO1xyXG4gICAgICAgIC8vIOODrOODs+ODgOODqeODvOOBp+S9v+eUqOOBmeOCi2h0bWzjg5XjgqHjgqTjg6vjgpLmjIflrprjgZnjgotcclxuICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLm1haW5XaW5kb3cubG9hZFVSTChwYXRoXzEuZGVmYXVsdC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL3NyYy9odG1sL2luZGV4Lmh0bWwnKSk7XHJcbiAgICAgICAgLy8g44Km44Kj44Oz44OJ44Km44GM6ZaJ44GY44KJ44KM44Gf44KJ44Ki44OX44Oq44KC57WC5LqGXHJcbiAgICAgICAgZ2xvYmFsVGhpcy5lbGVjdHJvbi5tYWluV2luZG93Lm9uKCdjbG9zZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAvLyDnorroqo3jg4DjgqTjgqLjg63jgrDjgafjga/jgYTjgpLjgq/jg6rjg4Pjgq/jgZfjgZ/jgonplonjgZjjgotcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgZWxlY3Ryb25fMS5kaWFsb2dcclxuICAgICAgICAgICAgICAgIC5zaG93TWVzc2FnZUJveChnbG9iYWxUaGlzLmVsZWN0cm9uLm1haW5XaW5kb3csIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdxdWVzdGlvbicsXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiBbJ1llcycsICdObyddLFxyXG4gICAgICAgICAgICAgICAgLy8gdGl0bGU6ICcnLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ+e1guS6huOBl+OBvuOBmeOBi++8nycsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5yZXNwb25zZSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcC5leGl0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGdsb2JhbFRoaXMuZWxlY3Ryb24ubWFpbldpbmRvdy5vbignY2xvc2VkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBlbGVjdHJvbl9sb2dfMS5kZWZhdWx0LmluZm8oJ1thcHBdIGNsb3NlJyk7XHJcbiAgICAgICAgICAgIGFwcC5leGl0KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8g6ZaL55m66ICF44OE44O844Or44KS6ZaL44GPXHJcbiAgICAgICAgLy8gZ2xvYmFsVGhpcy5lbGVjdHJvbi5tYWluV2luZG93LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xyXG4gICAgICAgIC8vIOOCv+OCueOCr+ODiOODrOOCpOOBruioreWumlxyXG4gICAgICAgIHZhciB0cmF5ID0gbnVsbDtcclxuICAgICAgICBhcHAud2hlblJlYWR5KCkudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRyYXkgPSBuZXcgZWxlY3Ryb25fMS5UcmF5KGljb25QYXRoXzEpO1xyXG4gICAgICAgICAgICB2YXIgY29udGV4dE1lbnUgPSBlbGVjdHJvbl8xLk1lbnUuYnVpbGRGcm9tVGVtcGxhdGUoW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiAn6Kit5a6aJyxcclxuICAgICAgICAgICAgICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLm1haW5XaW5kb3cuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ+OCs+ODoeODs+ODiCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsVGhpcy5lbGVjdHJvbi5jaGF0V2luZG93LmZvY3VzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6ICfntYLkuoYnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbFRoaXMuZWxlY3Ryb24ubWFpbldpbmRvdy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgdHJheS5zZXRUb29sVGlwKCfiiIgo776f4peO776fKeKIi++9s+++he+9sCcpO1xyXG4gICAgICAgICAgICB0cmF5LnNldENvbnRleHRNZW51KGNvbnRleHRNZW51KTtcclxuICAgICAgICAgICAgLy8g44K/44K544Kv44OI44Os44Kk44Kv44Oq44OD44Kv5pmC44Gu5oyZ5YuVXHJcbiAgICAgICAgICAgIHZhciBpc0RvdWJsZUNsaWNrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdHJheS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0RvdWJsZUNsaWNrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHV0aWxfMS5zbGVlcCgyMDApXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzRG91YmxlQ2xpY2tlZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLmNoYXRXaW5kb3cuZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7IH0pO1xyXG4gICAgICAgICAgICB0cmF5Lm9uKCdkb3VibGUtY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlzRG91YmxlQ2xpY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLm1haW5XaW5kb3cuZm9jdXMoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY3JlYXRlQ2hhdFdpbmRvd18xKCk7XHJcbiAgICB9KTtcclxuICAgIHZhciBjcmVhdGVDaGF0V2luZG93XzEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGNoYXRXaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvd18xKHtcclxuICAgICAgICAgICAgd2lkdGg6IDQwMCxcclxuICAgICAgICAgICAgdXNlQ29udGVudFNpemU6IHRydWUsXHJcbiAgICAgICAgICAgIGljb246IGljb25QYXRoXzEsXHJcbiAgICAgICAgICAgIHdlYlByZWZlcmVuY2VzOiB7XHJcbiAgICAgICAgICAgICAgICBub2RlSW50ZWdyYXRpb246IHRydWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIOOCv+OCueOCr+ODkOODvOOBq+ihqOekuuOBl+OBquOBhFxyXG4gICAgICAgICAgICBza2lwVGFza2JhcjogdHJ1ZSxcclxuICAgICAgICAgICAgLy8g6ZaJ44GY44KM44Gq44GP44GZ44KLXHJcbiAgICAgICAgICAgIGNsb3NhYmxlOiBmYWxzZSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBjaGF0V2luZG93LnNldFRpdGxlKCd1bmFjYXN0Jyk7XHJcbiAgICAgICAgY2hhdFdpbmRvdy5zZXRNZW51KG51bGwpO1xyXG4gICAgICAgIC8vIOODrOODs+ODgOODqeODvOOBp+S9v+eUqOOBmeOCi2h0bWzjg5XjgqHjgqTjg6vjgpLmjIflrprjgZnjgotcclxuICAgICAgICBjaGF0V2luZG93LmxvYWRVUkwocGF0aF8xLmRlZmF1bHQucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi9zcmMvaHRtbC9jaGF0Lmh0bWwnKSk7XHJcbiAgICAgICAgZ2xvYmFsVGhpcy5lbGVjdHJvbi5jaGF0V2luZG93ID0gY2hhdFdpbmRvdztcclxuICAgICAgICAvLyBjaGF0V2luZG93LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xyXG4gICAgfTtcclxuICAgIC8vIOmfs+WjsOWGjeeUn+OBp+OBjeOCi+OCiOOBhuOBq+OBmeOCi1xyXG4gICAgYXBwLmNvbW1hbmRMaW5lLmFwcGVuZFN3aXRjaCgnLS1hdXRvcGxheS1wb2xpY3knLCAnbm8tdXNlci1nZXN0dXJlLXJlcXVpcmVkJyk7XHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59O1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qKlxyXG4gKiA1Y2jkupLmj5tCQlPoqq3jgb/ovrzjgb/nlKjjg6Ljgrjjg6Xjg7zjg6tcclxuICovXHJcbnZhciBheGlvc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJheGlvc1wiKSk7XHJcbnZhciBpY29udl9saXRlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImljb252LWxpdGVcIikpOyAvLyDmloflrZfjgrPjg7zjg4nlpInmj5vnlKjjg5Hjg4PjgrHjg7zjgrhcclxudmFyIGVsZWN0cm9uX2xvZ18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJlbGVjdHJvbi1sb2dcIikpO1xyXG4vLyDjgrnjg4bjg7zjgr/jgrnjgrPjg7zjg4kzMDQgX05vdE1vZGlmaWVkXHJcbnZhciBOT1RfTU9ESUZJRUQgPSAnMzA0JztcclxudmFyIFJBTkdFX05PVF9TQVRJU0ZJQUJMRSA9ICc0MTYnO1xyXG4vLyDmnIDntYLlj5blvpfjgrnjg6zjg4Pjg4lcclxudmFyIGxhc3RUaHJlYWRVcmwgPSAnJztcclxuLy8g5pyA57WC44Os44K555Wq5Y+3XHJcbnZhciBsYXN0UmVzTnVtYmVyID0gMDtcclxuLy/mnIDntYLmm7TmlrDml6XmmYJcclxudmFyIGxhc3RNb2RpZmllZCA9IG51bGw7XHJcbi8vIOacgOe1guODkOOCpOODiOaVsFxyXG52YXIgbGFzdEJ5dGUgPSAwO1xyXG4vKipcclxuICog44Kz44Oz44K544OI44Op44Kv44K/XHJcbiAqXHJcbiAqL1xyXG52YXIgUmVhZDVjaCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFJlYWQ1Y2goKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAvLyBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Os44K56Kqt44G/6L6844G/XHJcbiAgICAgICAgICog5byV5pWw44Gn5oyH5a6a44GX44Gf5p2/44GL44KJ44Os44K544KS6Kqt44KAXHJcbiAgICAgICAgICog44Os44K555Wq5Y+344KS5oyH5a6a44GX44Gm44GE44Gq44GE5aC05ZCI44Gv5pyA5pawMeS7tuWPluW+l1xyXG4gICAgICAgICAqIEBwYXJhbSB0aHJlYWRVcmwg44K544OsVVJMXHJcbiAgICAgICAgICogQHBhcmFtIHJlc051bSDjg6zjgrnnlarlj7dcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnJlYWQgPSBmdW5jdGlvbiAodGhyZWFkVXJsLCByZXNOdW0pIHsgcmV0dXJuIF9fYXdhaXRlcihfdGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHJlcCwgcmVxdWVzdFVybCwgcmFuZ2UsIG9wdGlvbnMsIHJlc3BvbnNlSnNvbiwgcmVzcG9uc2UsIGhlYWRlcnMsIHN0ciwgZXJyb3JfMTtcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbG9nLmluZm8oYFtSZWFkNWNoXSB0aHJlYWRVcmw9JHt0aHJlYWRVcmx9IHJlc051bT0ke3Jlc051bX1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5p2/44KE5pyA57WC5pel44Os44K555Wq5Y+344GM44GL44KP44Gj44Gf44KJ5pyA5Yid44GL44KJ44Go44KK55u044GZKGxhc3Rtb2RpZmnjgaggcmFuZ2Xjga7jg6rjgrvjg4Pjg4gpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aHJlYWRVcmwgIT0gbGFzdFRocmVhZFVybCB8fCBOdW1iZXIuaXNOYU4ocmVzTnVtKSB8fCByZXNOdW0gPCBsYXN0UmVzTnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VGhyZWFkVXJsID0gdGhyZWFkVXJsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RCeXRlID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUudHJhY2UoJ1tSZWFkNWNoLmpzXXJlc2V0ZSEhISEhISEhISEhISEhISEnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUudHJhY2UoJ25vcmVzZXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVwID0gL1xcL3Rlc3RcXC9yZWFkLmNnaShcXC8uKykoXFwvLispXFwvLztcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdFVybCA9IHRocmVhZFVybC5yZXBsYWNlKHJlcCwgJyQxL2RhdCQyLmRhdCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5nZSA9IGxhc3RCeXRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiByZXF1ZXN0VXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDMgKiAxMDAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VUeXBlOiAnYXJyYXlidWZmZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdpZi1tb2RpZmllZC1zaW5jZSc6IGxhc3RNb2RpZmllZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByYW5nZTogJ2J5dGVzPScgKyByYW5nZSArICctJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMSwgMywgLCA0XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGF4aW9zXzEuZGVmYXVsdChvcHRpb25zKV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVycyA9IHJlc3BvbnNlLmhlYWRlcnM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIExhc3RNb2RpZmllZOOBqFJhbmdl5pu05paw5Yem55CGXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoZWFkZXJzWydsYXN0LW1vZGlmaWVkJ10gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdE1vZGlmaWVkID0gaGVhZGVyc1snbGFzdC1tb2RpZmllZCddO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IGljb252X2xpdGVfMS5kZWZhdWx0LmRlY29kZShCdWZmZXIuZnJvbShyZXNwb25zZS5kYXRhKSwgJ1NoaWZ0X0pJUycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDjg6zjgrnjg53jg7Pjgrnjgqrjg5bjgrjjgqfjgq/jg4jkvZzmiJDjgIFjb250ZW50LXJhbmdl44GM44GC44KL5aC05ZCI44Go44Gq44GE5aC05ZCI44Gn5Yem55CG44KS5YiG44GR44KLXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoZWFkZXJzWydjb250ZW50LXJhbmdlJ10gPT0gbnVsbCB8fCBsYXN0Qnl0ZSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLnRyYWNlKCdbUmVhZDVjaC5yZWFkXWNvbnRlbnQtcmFuZ2U9JyArIGhlYWRlcnNbJ2NvbnRlbnQtcmFuZ2UnXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZUpzb24gPSBwdXJzZU5ld1Jlc3BvbnNlKHN0ciwgcmVzTnVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlSnNvbiA9IHB1cnNlRGlmZlJlc3BvbnNlKHN0ciwgcmVzTnVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlj5blvpfjg5DjgqTjg4jmlbDooajnpLpcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ10gIT0gbnVsbCAmJiByZXNwb25zZUpzb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEJ5dGUgPSBsYXN0Qnl0ZSArIHBhcnNlSW50KGhlYWRlcnNbJ2NvbnRlbnQtbGVuZ3RoJ10pIC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUudHJhY2UoJ1tSZWFkNWNoLnJlYWRdbGFzdEJ5dGU9JyArIGxhc3RCeXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA0XTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yXzEgPSBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlSnNvbiA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyb3JfMS5zdGF0dXMgPT0gTk9UX01PRElGSUVEKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVjdHJvbl9sb2dfMS5kZWZhdWx0LmVycm9yKCdbUmVhZDVjaC5qc101Y2jns7tCQlPjg6zjgrnlj5blvpdBUEnjg6rjgq/jgqjjgrnjg4jjgqjjg6njg7zjgIFOT1RfTU9ESUZJRUQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChlcnJvcl8xLnN0YXR1cyA9PSBSQU5HRV9OT1RfU0FUSVNGSUFCTEUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZWN0cm9uX2xvZ18xLmRlZmF1bHQuZXJyb3IoJ1tSZWFkNWNoLmpzXTVjaOezu0JCU+ODrOOCueWPluW+l0FQSeODquOCr+OCqOOCueODiOOCqOODqeODvOOAgVJBTkdFX05PVF9TQVRJU0ZJQUJMRScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlY3Ryb25fbG9nXzEuZGVmYXVsdC5lcnJvcignW1JlYWQ1Y2guanNdNWNo57O7QkJT44Os44K55Y+W5b6XQVBJ44Oq44Kv44Ko44K544OI44Ko44Op44O844CBbWVzc2FnZT0nICsgZXJyb3JfMS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nvbm5lY3Rpb24gZXJyb3InKTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovLCByZXNwb25zZUpzb25dO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTsgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBSZWFkNWNoO1xyXG59KCkpO1xyXG4vKipcclxuICog5Y+W5b6X44GX44Gf44Os44K544Od44Oz44K577yI6KSH5pWw77yJ44Gu44OR44O844K5XHJcbiAqIOaIu+OCiuOBqOOBl+OBpuODkeODvOOCueOBl+OBn2pzb27jgqrjg5bjgrjjgqfjgq/jg4jjga7phY3liJfjgpLov5TjgZlcclxuICogQHBhcmFtIHJlcyDmnb/jgYvjgonov5TljbTjgZXjgozjgZ9kYXRcclxuICogQHBhcmFtIHJlc051bSDjg6rjgq/jgqjjgrnjg4jjgZXjgozjgZ/jg6zjgrnnlarlj7dcclxuICovXHJcbnZhciBwdXJzZU5ld1Jlc3BvbnNlID0gZnVuY3Rpb24gKHJlcywgcmVzTnVtKSB7XHJcbiAgICAvLyDntZDmnpzjgpLmoLzntI3jgZnjgovphY3liJdcclxuICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgIC8vIOODrOOCueeVquWPt1xyXG4gICAgdmFyIG51bSA9IDA7XHJcbiAgICAvLyDmlrDnnYDjg6zjgrnjgpLmlLnooYzjgZTjgajjgatTcGxpdOOBmeOCi1xyXG4gICAgdmFyIHJlc0FycmF5ID0gcmVzLnNwbGl0KC9cXHJcXG58XFxyfFxcbi8pO1xyXG4gICAgLy8g5paw552A44Gq44GX44Gq44KJ5oi744KL44CCXHJcbiAgICBpZiAocmVzQXJyYXkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIC8vIOmFjeWIl+OBruacgOW+jOOBq+epuuOBruimgee0oOOBjOWFpeOCi+OBk+OBqOOBjOOBguOCi+OBruOBp+WPluOCiumZpOOBj1xyXG4gICAgaWYgKHJlc0FycmF5W3Jlc0FycmF5Lmxlbmd0aCAtIDFdLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHJlc0FycmF5LnBvcCgpO1xyXG4gICAgfVxyXG4gICAgLy8g44Os44K55oyH5a6a44Gq44GX44Gu5aC05ZCI5pyA5b6M44GuMeS7tuWPluW+l1xyXG4gICAgaWYgKE51bWJlci5pc05hTihyZXNOdW0pKSB7XHJcbiAgICAgICAgbnVtID0gcmVzQXJyYXkubGVuZ3RoIC0gMTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIG51bSA9IHJlc051bSAtIDE7XHJcbiAgICB9XHJcbiAgICAvLyAx6KGM44GU44Go44Gr44OR44O844K544GZ44KLXHJcbiAgICBmb3IgKDsgbnVtIDwgcmVzQXJyYXkubGVuZ3RoOyBudW0rKykge1xyXG4gICAgICAgIC8vIOODkeODvOOCueODoeOCveODg+ODieWRvOOBs+WHuuOBl1xyXG4gICAgICAgIGlmIChyZXNBcnJheVtudW1dLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2gocHVyc2VSZXNwb25zZShyZXNBcnJheVtudW1dLCBudW0gKyAxKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGFzdFJlc051bWJlciA9IG51bSArIDE7XHJcbiAgICAvLyDjg5Hjg7zjgrnjgZfjgZ/jgqrjg5bjgrjjgqfjgq/jg4jjga7phY3liJfjgpLov5TljbRcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcbi8qKlxyXG4gKiDlj5blvpfjgZfjgZ/jg6zjgrnjg53jg7PjgrnvvIjopIfmlbDvvInjga7jg5Hjg7zjgrlcclxuICog5oi744KK44Go44GX44Gm44OR44O844K544GX44GfanNvbuOCquODluOCuOOCp+OCr+ODiOOBrumFjeWIl+OCkui/lOOBmVxyXG4gKiBAcGFyYW0gcmVzIOadv+OBi+OCiei/lOWNtOOBleOCjOOBn2RhdDHooYzliIZcclxuICogQHBhcmFtIHJlc051bSDjg6rjgq/jgqjjgrnjg4jjgZXjgozjgZ/jg6zjgrnnlarlj7dcclxuICovXHJcbnZhciBwdXJzZURpZmZSZXNwb25zZSA9IGZ1bmN0aW9uIChyZXMsIHJlc051bSkge1xyXG4gICAgLy/ntZDmnpzjgpLmoLzntI3jgZnjgovphY3liJdcclxuICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgIC8vIOODrOOCueeVquWPt1xyXG4gICAgdmFyIG51bSA9IHJlc051bTtcclxuICAgIC8v5paw552A44Os44K544KS5pS56KGM44GU44Go44GrU3BsaXTjgZnjgotcclxuICAgIHZhciByZXNBcnJheSA9IHJlcy5zcGxpdCgvXFxyXFxufFxccnxcXG4vKTtcclxuICAgIC8vIOaWsOedgOOBquOBl+OBquOCieaIu+OCi+OAglxyXG4gICAgaWYgKHJlc0FycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyDphY3liJfjga7mnIDlvozjgavnqbrjga7opoHntKDjgYzlhaXjgovjgZPjgajjgYzjgYLjgovjga7jgaflj5bjgorpmaTjgY9cclxuICAgICAgICBpZiAocmVzQXJyYXlbcmVzQXJyYXkubGVuZ3RoIC0gMV0ubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgcmVzQXJyYXkucG9wKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc29sZS50cmFjZSgnW1JlYWQ1Y2gucHVyc2VEaWZmUmVzcG9uc2Vd5Y+W5b6X44Os44K555Wq5Y+3PScgKyBudW0pO1xyXG4gICAgLy8x6KGM44GU44Go44Gr44OR44O844K544GZ44KLXHJcbiAgICByZXNBcnJheS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIC8v44OR44O844K544Oh44K944OD44OJ5ZG844Gz5Ye644GXXHJcbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2gocHVyc2VSZXNwb25zZSh2YWx1ZSwgbnVtKSk7XHJcbiAgICAgICAgICAgIG51bSsrO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy8g44OR44O844K544GX44Gf44Kq44OW44K444Kn44Kv44OI44Gu6YWN5YiX44KS6L+U5Y20XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG4vKipcclxuICog44Os44K544Od44Oz44K544Gu44OR44O844K5XHJcbiAqIEpzb27jgqrjg5bjgrjjgqfjgq/jg4jjgpLov5TljbTjgZnjgotcclxuICogQHBhcmFtIFN0cmluZyAvLyByZXMg44Os44K544Od44Oz44K5MeODrOOCuVxyXG4gKiBAcGFyYW0gSW50ZWdlciAvLyBudW0g44Os44K555Wq77yIMOOCueOCv+ODvOODiO+8iVxyXG4gKi9cclxudmFyIHB1cnNlUmVzcG9uc2UgPSBmdW5jdGlvbiAocmVzLCBudW0pIHtcclxuICAgIC8vQVBJ44Gu6L+U5Y205YCk44KSPD7jgafliIblibJcclxuICAgIC8v44Os44K544Gu6KaB57SgXHJcbiAgICAvLzA65ZCN5YmNXHJcbiAgICAvLzE644Oh44Ki44OJXHJcbiAgICAvLzI65pel5LuY44GoSUQg77yIMjAxOS8xMS8wMyjml6UpIDA4OjU1OjAwIElEOmthbmlrYW5p77yJ44G/44Gf44GE44Gr6KGo56S6XHJcbiAgICAvLzM65pys5paHXHJcbiAgICAvLzQ644K544Os44K/44KkIO+8iDHjg6zjgrnnm67jga7jgb/vvIlcclxuICAgIHZhciBzcGxpdFJlcyA9IHJlcy5zcGxpdCgnPD4nKTtcclxuICAgIC8vIOaXpeS7mOOBqElE5YiG6Zui5Yem55CG44CBJyBJRDon44Gn5Yy65YiH44KLXHJcbiAgICB2YXIgZGF0ZUlkID0gc3BsaXRSZXNbMl0uc3BsaXQoJyBJRDonKTtcclxuICAgIHZhciBkYXRlID0gZGF0ZUlkWzBdO1xyXG4gICAgdmFyIGlkID0gZGF0ZUlkLmxlbmd0aCA9PT0gMiA/IGRhdGVJZFsxXSA6ICcnO1xyXG4gICAgdmFyIHJlc0pzb24gPSB7XHJcbiAgICAgICAgbnVtYmVyOiBudW0udG9TdHJpbmcoKSxcclxuICAgICAgICBuYW1lOiBzcGxpdFJlc1swXSxcclxuICAgICAgICBlbWFpbDogc3BsaXRSZXNbMV0sXHJcbiAgICAgICAgZGF0ZTogZGF0ZSxcclxuICAgICAgICB0ZXh0OiBzcGxpdFJlc1szXSxcclxuICAgICAgICAvLyB0aHJlYWRUaXRsZTogc3BsaXRSZXNbNF0sXHJcbiAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgIGltZ1VybDogJycsXHJcbiAgICB9O1xyXG4gICAgLy8g44Kq44OW44K444Kn44Kv44OI44KS6L+U5Y20XHJcbiAgICByZXR1cm4gcmVzSnNvbjtcclxufTtcclxuZXhwb3J0cy5kZWZhdWx0ID0gUmVhZDVjaDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59O1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qKlxyXG4gKiDjgZfjgZ/jgonjgbDoqq3jgb/ovrzjgb/nlKjjg6Ljgrjjg6Xjg7zjg6tcclxuICovXHJcbnZhciBheGlvc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJheGlvc1wiKSk7XHJcbnZhciBpY29udl9saXRlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImljb252LWxpdGVcIikpOyAvLyDmloflrZfjgrPjg7zjg4nlpInmj5vnlKjjg5Hjg4PjgrHjg7zjgrhcclxuLyoqXHJcbiAqIOOCs+ODs+OCueODiOODqeOCr+OCv1xyXG4gKi9cclxudmFyIFJlYWRTaXRhcmFiYSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIFJlYWRTaXRhcmFiYSgpIHtcclxuICAgICAgICAvLyBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg6zjgrnoqq3jgb/ovrzjgb9cclxuICAgICAgICAgKiBAZGVzY3JpcHRpb24g5byV5pWw44Gn5oyH5a6a44GX44Gf5p2/44GL44KJ44Os44K544KS6Kqt44KA44CCXHJcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIOODrOOCueeVquWPt+OCkuaMh+WumuOBl+OBpuOBhOOBquOBhOWgtOWQiOOBr+acgOaWsDHku7blj5blvpdcclxuICAgICAgICAgKiBAcGFyYW0gdGhyZWFkVXJsIOOCueODrFVSTFxyXG4gICAgICAgICAqIEBwYXJhbSByZXNOdW0g44Os44K555Wq5Y+3XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5yZWFkID0gZnVuY3Rpb24gKHRocmVhZFVybCwgcmVzTnVtKSB7IHJldHVybiBfX2F3YWl0ZXIoX3RoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciByZXF1ZXN0VXJsLCBvcHRpb25zLCByZXNwb25zZSwgc3RyLCByZXNwb25zZUpzb247XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RVcmwgPSB0aHJlYWRVcmwucmVwbGFjZSgncmVhZC5jZ2knLCAncmF3bW9kZS5jZ2knKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc051bSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOODrOOCueeVquWPt+OBjOOBguOCi+WgtOWQiOODrOOCueeVquWPt+S7pemZjeOCkuWPluW+l1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdFVybCArPSByZXNOdW0gKyAnLSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDjg6zjgrnnlarlj7fjgYzjgarjgYTloLTlkIjmnIDmlrDjga4x5Lu25Y+W5b6XXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0VXJsICs9ICdsMSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogcmVxdWVzdFVybCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZVR5cGU6ICdhcnJheWJ1ZmZlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiAzICogMTAwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgYXhpb3NfMS5kZWZhdWx0KG9wdGlvbnMpXTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgPSBpY29udl9saXRlXzEuZGVmYXVsdC5kZWNvZGUoQnVmZmVyLmZyb20ocmVzcG9uc2UuZGF0YSksICdFVUMtSlAnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VKc29uID0gcHVyc2VOZXdSZXNwb25zZShzdHIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgcmVzcG9uc2VKc29uXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7IH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gUmVhZFNpdGFyYWJhO1xyXG59KCkpO1xyXG4vKipcclxuICog5Y+W5b6X44GX44Gf44Os44K544Od44Oz44K577yI6KSH5pWw77yJ44Gu44OR44O844K5XHJcbiAqIEBwYXJhbSByZXNcclxuICovXHJcbnZhciBwdXJzZU5ld1Jlc3BvbnNlID0gZnVuY3Rpb24gKHJlcykge1xyXG4gICAgLy/ntZDmnpzjgpLmoLzntI3jgZnjgovphY3liJdcclxuICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgIC8vIOaWsOedgOODrOOCueOCkuaUueihjOOBlOOBqOOBq1NwbGl044GZ44KLXHJcbiAgICB2YXIgcmVzQXJyYXkgPSByZXMuc3BsaXQoL1xcclxcbnxcXHJ8XFxuLyk7XHJcbiAgICAvLyAx6KGM44GU44Go44Gr44OR44O844K544GZ44KLXHJcbiAgICByZXNBcnJheS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIC8vIOODkeODvOOCueODoeOCveODg+ODieWRvOOBs+WHuuOBl1xyXG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHB1cnNlUmVzcG9uc2UodmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcbi8qKlxyXG4gKiDjg6zjgrnjg53jg7Pjgrnjga7jg5Hjg7zjgrlcclxuICogSnNvbuOCquODluOCuOOCp+OCr+ODiOOCkui/lOWNtOOBmeOCi1xyXG4gKiBAcGFyYW0gU3RyaW5nIC8vIHJlcyDjg6zjgrnjg53jg7Pjgrkx44Os44K5XHJcbiAqL1xyXG52YXIgcHVyc2VSZXNwb25zZSA9IGZ1bmN0aW9uIChyZXMpIHtcclxuICAgIC8vQVBJ44Gu6L+U5Y205YCk44KSPD7jgafliIblibJcclxuICAgIC8v44Os44K544Gu6KaB57SgXHJcbiAgICAvLzA644Os44K555Wq5Y+3XHJcbiAgICAvLzE65ZCN5YmNXHJcbiAgICAvLzI644Oh44Ki44OJXHJcbiAgICAvLzM65pel5LuYXHJcbiAgICAvLzQ65pys5paHXHJcbiAgICAvLzU644K544Os44K/44KkXHJcbiAgICAvLzY6SURcclxuICAgIHZhciBzcGxpdFJlcyA9IHJlcy5zcGxpdCgnPD4nKTtcclxuICAgIHZhciByZXNKc29uID0ge1xyXG4gICAgICAgIG51bWJlcjogc3BsaXRSZXNbMF0sXHJcbiAgICAgICAgbmFtZTogc3BsaXRSZXNbMV0sXHJcbiAgICAgICAgZW1haWw6IHNwbGl0UmVzWzJdLFxyXG4gICAgICAgIGRhdGU6IHNwbGl0UmVzWzNdLFxyXG4gICAgICAgIHRleHQ6IHNwbGl0UmVzWzRdLFxyXG4gICAgICAgIC8vIHRocmVhZFRpdGxlOiBzcGxpdFJlc1s1XSxcclxuICAgICAgICBpZDogc3BsaXRSZXNbNl0sXHJcbiAgICAgICAgaW1nVXJsOiAnJyxcclxuICAgIH07XHJcbiAgICAvLyDjgqrjg5bjgrjjgqfjgq/jg4jjgpLov5TljbRcclxuICAgIHJldHVybiByZXNKc29uO1xyXG59O1xyXG5leHBvcnRzLmRlZmF1bHQgPSBSZWFkU2l0YXJhYmE7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXHJcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59O1xyXG52YXIgX19zcHJlYWRBcnJheXMgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXlzKSB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcclxuICAgIGZvciAodmFyIHIgPSBBcnJheShzKSwgayA9IDAsIGkgPSAwOyBpIDwgaWw7IGkrKylcclxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcclxuICAgICAgICAgICAgcltrXSA9IGFbal07XHJcbiAgICByZXR1cm4gcjtcclxufTtcclxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcclxufTtcclxudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xyXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIHJlc3VsdFtrXSA9IG1vZFtrXTtcclxuICAgIHJlc3VsdFtcImRlZmF1bHRcIl0gPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBwYXRoXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcInBhdGhcIikpO1xyXG52YXIgZXhwcmVzc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJleHByZXNzXCIpKTtcclxudmFyIGVsZWN0cm9uX2xvZ18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJlbGVjdHJvbi1sb2dcIikpO1xyXG52YXIgZGFua190d2l0Y2hfaXJjXzEgPSByZXF1aXJlKFwiZGFuay10d2l0Y2gtaXJjXCIpO1xyXG52YXIgeW91dHViZV9jaGF0XzEgPSByZXF1aXJlKFwiLi95b3V0dWJlLWNoYXRcIik7XHJcbnZhciBlbGVjdHJvbl8xID0gcmVxdWlyZShcImVsZWN0cm9uXCIpO1xyXG52YXIgZXhwcmVzc193c18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJleHByZXNzLXdzXCIpKTtcclxudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XHJcbi8vIOODrOOCueWPluW+l0FQSeOCkuOCu+ODg+ODiFxyXG52YXIgZ2V0UmVzXzEgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4vZ2V0UmVzXCIpKTtcclxudmFyIGJvdXlvbWlfY2hhbl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2JvdXlvbWktY2hhblwiKSk7XHJcbnZhciBjaGlsZF9wcm9jZXNzXzEgPSByZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKTtcclxudmFyIGNvbnN0XzEgPSByZXF1aXJlKFwiLi9jb25zdFwiKTtcclxudmFyIGFwcDtcclxuLy8g44K144O844OQ44O844KS44Kw44Ot44O844OQ44Or5aSJ5pWw44Gr44K744OD44OI44Gn44GN44KL44KI44GG44Gr44GZ44KL77yI44K144O844OQ44O85YGc5q2i5Yem55CG44Gu44Gf44KB77yJXHJcbnZhciBzZXJ2ZXI7XHJcbi8qKiDmo5Loqq3jgb/jgaHjgoPjgpPjgqTjg7Pjgrnjgr/jg7PjgrkgKi9cclxudmFyIGJvdXlvbWk7XHJcbi8qKiDjgrnjg6zjg4Pjg4nlrprmnJ/lj5blvpflrp/ooYzjgZnjgovjgYsgKi9cclxudmFyIHRocmVhZEludGVydmFsRXZlbnQgPSBmYWxzZTtcclxuLyoqIOOCreODpeODvOWHpueQhuWun+ihjOOBmeOCi+OBiyAqL1xyXG52YXIgaXNFeGVjdXRlUXVlID0gZmFsc2U7XHJcbi8qKlxyXG4gKiDjgrXjg7zjg5Djg7zotbfli5VcclxuICovXHJcbmVsZWN0cm9uXzEuaXBjTWFpbi5vbihjb25zdF8xLmVsZWN0cm9uRXZlbnRbJ2FwcGx5LWNvbmZpZyddLCBmdW5jdGlvbiAoZXZlbnQsIGNvbmZpZykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBpc0NoYW5nZWRVcmwsIGlzQ2hhbmdlU2VQYXRoLCByZXQ7XHJcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBlbGVjdHJvbl9sb2dfMS5kZWZhdWx0LmluZm8oJ1thcHBseS1jb25maWddIHN0YXJ0Jyk7XHJcbiAgICAgICAgICAgICAgICBlbGVjdHJvbl9sb2dfMS5kZWZhdWx0LmluZm8oY29uZmlnKTtcclxuICAgICAgICAgICAgICAgIGlzQ2hhbmdlZFVybCA9IGdsb2JhbFRoaXMuY29uZmlnLnVybCAhPT0gY29uZmlnLnVybDtcclxuICAgICAgICAgICAgICAgIGlzQ2hhbmdlU2VQYXRoID0gZ2xvYmFsVGhpcy5jb25maWcuc2VQYXRoICE9PSBjb25maWcuc2VQYXRoO1xyXG4gICAgICAgICAgICAgICAgZ2xvYmFsVGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzQ2hhbmdlU2VQYXRoKSByZXR1cm4gWzMgLypicmVhayovLCAyXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGV4cG9ydHMuZmluZFNlTGlzdCgpXTtcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSAyO1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzQ2hhbmdlZFVybCkgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBnZXRSZXNfMS5nZXRSZXMoZ2xvYmFsVGhpcy5jb25maWcudXJsLCBOYU4pXTtcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgcmV0ID0gX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmV0KTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsVGhpcy5lbGVjdHJvbi5tYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoY29uc3RfMS5lbGVjdHJvbkV2ZW50WydzaG93LWFsZXJ0J10sICfmjrLnpLrmnb9VUkzjgYzjgYrjgYvjgZfjgZ3jgYbjgafjgZknKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLnRocmVhZE51bWJlciA9IE51bWJlcihyZXRbcmV0Lmxlbmd0aCAtIDFdLm51bWJlcik7XHJcbiAgICAgICAgICAgICAgICBlbGVjdHJvbl9sb2dfMS5kZWZhdWx0LmluZm8oXCJbYXBwbHktY29uZmlnXSBuZXcgcmVzIG51bSBpcyBcIiArIGdsb2JhbFRoaXMuZWxlY3Ryb24udGhyZWFkTnVtYmVyKTtcclxuICAgICAgICAgICAgICAgIC8vIOODgeODo+ODg+ODiOOCpuOCo+ODs+ODieOCpuOBqOODluODqeOCpuOCtuOBq+OAgeacq+WwvuOBruOCueODrOOBoOOBkeWPjeaYoOOBmeOCi1xyXG4gICAgICAgICAgICAgICAgc2VuZERvbShbcmV0W3JldC5sZW5ndGggLSAxXV0pO1xyXG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSA0O1xyXG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSk7IH0pO1xyXG4vKipcclxuICog44K144O844OQ44O86LW35YuVXHJcbiAqL1xyXG5lbGVjdHJvbl8xLmlwY01haW4ub24oY29uc3RfMS5lbGVjdHJvbkV2ZW50WydzdGFydC1zZXJ2ZXInXSwgZnVuY3Rpb24gKGV2ZW50LCBjb25maWcpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaWQ7XHJcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgZ2xvYmFsVGhpcy5lbGVjdHJvbi5jaGF0V2luZG93LndlYkNvbnRlbnRzLnNlbmQoY29uc3RfMS5lbGVjdHJvbkV2ZW50WydjbGVhci1jb21tZW50J10pO1xyXG4gICAgICAgIGdsb2JhbFRoaXMuZWxlY3Ryb24udGhyZWFkTnVtYmVyID0gMDtcclxuICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLmNvbW1lbnRRdWV1ZUxpc3QgPSBbXTtcclxuICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLnRocmVhZENvbm5lY3Rpb25FcnJvciA9IDA7XHJcbiAgICAgICAgYXBwID0gZXhwcmVzc193c18xLmRlZmF1bHQoZXhwcmVzc18xLmRlZmF1bHQoKSkuYXBwO1xyXG4gICAgICAgIGFwcC5zZXQoJ3ZpZXcgZW5naW5lJywgJ2VqcycpO1xyXG4gICAgICAgIC8vIHZpZXfjg4fjgqPjg6zjgq/jg4jjg6rjga7mjIflrppcclxuICAgICAgICBhcHAuc2V0KCd2aWV3cycsIHBhdGhfMS5kZWZhdWx0LnJlc29sdmUoX19kaXJuYW1lLCAnLi4vdmlld3MnKSk7XHJcbiAgICAgICAgLy8g6Kit5a6a5oOF5aCx44KS44Kw44Ot44O844OQ44Or5aSJ5pWw44G444K744OD44OI44GZ44KLXHJcbiAgICAgICAgZ2xvYmFsVGhpcy5jb25maWcgPSBjb25maWc7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1tzdGFydFNlcnZlcl3oqK3lrprlgKQgPSAnKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhnbG9iYWxUaGlzLmNvbmZpZyk7XHJcbiAgICAgICAgYXBwLmdldCgnLycsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xyXG4gICAgICAgICAgICByZXMucmVuZGVyKCdzZXJ2ZXInLCBjb25maWcpO1xyXG4gICAgICAgICAgICByZXEuY29ubmVjdGlvbi5lbmQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgIGFwcC5nZXQoJy9pZCcsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xyXG4gICAgICAgICAgICByZXMuc2VuZChcIlwiICsgaWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIOmdmeeahOOCs+ODs+ODhuODs+ODhOOBr3B1YmxpY+ODh+OCo+ODrOOCr+ODiOODquOBruS4rei6q+OCkuS9v+eUqOOBmeOCi+OBqOOBhOOBhuWuo+iogFxyXG4gICAgICAgIGFwcC51c2UoZXhwcmVzc18xLmRlZmF1bHQuc3RhdGljKHBhdGhfMS5kZWZhdWx0LnJlc29sdmUoX19kaXJuYW1lLCAnLi4vcHVibGljJykpKTtcclxuICAgICAgICAvLyAyY2jkupLmj5vmjrLnpLrmnb/jga7lj5blvpdcclxuICAgICAgICBhcHAudXNlKCcvZ2V0UmVzJywgZ2V0UmVzXzEuZGVmYXVsdCk7XHJcbiAgICAgICAgLy8gU0XjgpLlj5blvpfjgZnjgotcclxuICAgICAgICBpZiAoZ2xvYmFsVGhpcy5jb25maWcuc2VQYXRoKSB7XHJcbiAgICAgICAgICAgIGV4cG9ydHMuZmluZFNlTGlzdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBUd2l0Y2jjgavmjqXntppcclxuICAgICAgICBpZiAoZ2xvYmFsVGhpcy5jb25maWcudHdpdGNoSWQpIHtcclxuICAgICAgICAgICAgc3RhcnRUd2l0Y2hDaGF0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFlvdXR1YmXjg4Hjg6Pjg4Pjg4hcclxuICAgICAgICBpZiAoZ2xvYmFsVGhpcy5jb25maWcueW91dHViZUlkKSB7XHJcbiAgICAgICAgICAgIHN0YXJ0WW91dHViZUNoYXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8g5qOS6Kqt44G/44Gh44KD44KT5o6l57aaXHJcbiAgICAgICAgaWYgKGNvbmZpZy50eXBlWW9taWtvID09PSAnYm91eW9taScpIHtcclxuICAgICAgICAgICAgaWYgKGNvbmZpZy5ib3V5b21pUG9ydCkge1xyXG4gICAgICAgICAgICAgICAgYm91eW9taSA9IG5ldyBib3V5b21pX2NoYW5fMS5kZWZhdWx0KHsgcG9ydDogY29uZmlnLmJvdXlvbWlQb3J0LCB2b2x1bWU6IGNvbmZpZy5ib3V5b21pVm9sdW1lIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOODrOOCueWPluW+l+Wumuacn+Wun+ihjFxyXG4gICAgICAgIHRocmVhZEludGVydmFsRXZlbnQgPSB0cnVlO1xyXG4gICAgICAgIGdldFJlc0ludGVydmFsKCk7XHJcbiAgICAgICAgLy8g44Kt44Ol44O85Yem55CG44Gu6ZaL5aeLXHJcbiAgICAgICAgaXNFeGVjdXRlUXVlID0gdHJ1ZTtcclxuICAgICAgICB0YXNrU2NoZWR1bGVyKCk7XHJcbiAgICAgICAgLy8gV2ViU29ja2V044KS56uL44Gm44KLXHJcbiAgICAgICAgYXBwLndzKCcvd3MnLCBmdW5jdGlvbiAod3MsIHJlcSkge1xyXG4gICAgICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLnNvY2tldCA9IHdzO1xyXG4gICAgICAgICAgICB3cy5vbignbWVzc2FnZScsIGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLnRyYWNlKCdSZWNlaXZlZDogJyArIG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1lc3NhZ2UgPT09ICdwaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHdzLnNlbmQoJ3BvbmcnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHdzLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdJIGxvc3QgYSBjbGllbnQnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8g5oyH5a6a44GX44Gf44Od44O844OI44Gn5b6F44Gh5Y+X44GR6ZaL5aeLXHJcbiAgICAgICAgc2VydmVyID0gYXBwLmxpc3Rlbihjb25maWcucG9ydCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnW3N0YXJ0U2VydmVyXSBzdGFydCBzZXJ2ZXIgb24gcG9ydDonICsgY29uZmlnLnBvcnQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIOaIkOWKn+ODoeODg+OCu+ODvOOCuOi/lOWNtFxyXG4gICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gJ3N1Y2Nlc3MnO1xyXG4gICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcclxuICAgIH0pO1xyXG59KTsgfSk7XHJcbmV4cG9ydHMuZmluZFNlTGlzdCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgbGlzdCwgZV8xO1xyXG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFswLCA0LCAsIDVdKTtcclxuICAgICAgICAgICAgICAgIGlmICghZ2xvYmFsVGhpcy5jb25maWcuc2VQYXRoKSByZXR1cm4gWzMgLypicmVhayovLCAyXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHV0aWxfMS5yZWFkV2F2RmlsZXMoZ2xvYmFsVGhpcy5jb25maWcuc2VQYXRoKV07XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIGxpc3QgPSBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLnNlTGlzdCA9IGxpc3QubWFwKGZ1bmN0aW9uIChmaWxlKSB7IHJldHVybiBnbG9iYWxUaGlzLmNvbmZpZy5zZVBhdGggKyBcIi9cIiArIGZpbGU7IH0pO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTRSBmaWxlcyA9IFwiICsgZ2xvYmFsVGhpcy5lbGVjdHJvbi5zZUxpc3QubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbMyAvKmJyZWFrKi8sIDNdO1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLnNlTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSAzO1xyXG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBbMyAvKmJyZWFrKi8sIDVdO1xyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICBlXzEgPSBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLm1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZChjb25zdF8xLmVsZWN0cm9uRXZlbnRbJ3Nob3ctYWxlcnQnXSwgJ+edgOS/oemfs+OBruODkeOCueOBjOOBiuOBi+OBl+OBneOBhuOBp+OBmScpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNV07XHJcbiAgICAgICAgICAgIGNhc2UgNTogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KTsgfTtcclxuLyoqXHJcbiAqIFR3aXRjaOODgeODo+ODg+ODiOOBq+aOpee2mlxyXG4gKiBAZGVzY3JpcHRpb24g5YaN5o6l57aa5Yem55CG44Gv44Op44Kk44OW44Op44Oq44GM5Yud5omL44Gr44KE44Gj44Gm44GP44KM44KLXHJcbiAqL1xyXG52YXIgc3RhcnRUd2l0Y2hDaGF0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB0d2l0Y2hDaGF0O1xyXG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHR3aXRjaENoYXQgPSBuZXcgZGFua190d2l0Y2hfaXJjXzEuQ2hhdENsaWVudCgpO1xyXG4gICAgICAgICAgICB0d2l0Y2hDaGF0LmNvbm5lY3QoKTtcclxuICAgICAgICAgICAgdHdpdGNoQ2hhdC5qb2luKGdsb2JhbFRoaXMuY29uZmlnLnR3aXRjaElkKTtcclxuICAgICAgICAgICAgLy8g44OB44Oj44OD44OI5Y+X5L+hXHJcbiAgICAgICAgICAgIHR3aXRjaENoYXQub24oJ1BSSVZNU0cnLCBmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW1nVXJsID0gJy4vaW1nL3R3aXRjaC5wbmcnO1xyXG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBtc2cuZGlzcGxheU5hbWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IG1zZy5tZXNzYWdlVGV4dDtcclxuICAgICAgICAgICAgICAgIGdsb2JhbFRoaXMuZWxlY3Ryb24uY29tbWVudFF1ZXVlTGlzdC5wdXNoKHsgaW1nVXJsOiBpbWdVcmwsIG5hbWU6IG5hbWUsIHRleHQ6IHRleHQgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLnR3aXRjaENoYXQgPSB0d2l0Y2hDaGF0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBlbGVjdHJvbl9sb2dfMS5kZWZhdWx0LmVycm9yKGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qL107XHJcbiAgICB9KTtcclxufSk7IH07XHJcbi8qKiBZb3V0dWJl44OB44Oj44OD44OI44Gr5o6l57aaICovXHJcbnZhciBzdGFydFlvdXR1YmVDaGF0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB0dWJlUmVzdWx0LCBlXzI7XHJcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBfYS50cnlzLnB1c2goWzAsIDQsICwgNV0pO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1tZb3V0dWJlIENoYXRdIGNvbm5lY3Qgc3RhcnRlZCcpO1xyXG4gICAgICAgICAgICAgICAgZ2xvYmFsVGhpcy5lbGVjdHJvbi55b3V0dWJlQ2hhdCA9IG5ldyB5b3V0dWJlX2NoYXRfMS5MaXZlQ2hhdCh7IGNoYW5uZWxJZDogZ2xvYmFsVGhpcy5jb25maWcueW91dHViZUlkIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8g5o6l57aa6ZaL5aeL44Kk44OZ44Oz44OIXHJcbiAgICAgICAgICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLnlvdXR1YmVDaGF0Lm9uKCdzdGFydCcsIGZ1bmN0aW9uIChsaXZlSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIltZb3V0dWJlIENoYXRdIGNvbm5lY3RlZCBsaXZlSWQgPSBcIiArIGxpdmVJZCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIOaOpee2mue1guS6huOCpOODmeODs+ODiFxyXG4gICAgICAgICAgICAgICAgZ2xvYmFsVGhpcy5lbGVjdHJvbi55b3V0dWJlQ2hhdC5vbignZW5kJywgZnVuY3Rpb24gKHJlYXNvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdbWW91dHViZSBDaGF0XSBkaXNjb25uZWN0Jyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIOODgeODo+ODg+ODiOWPl+S/oVxyXG4gICAgICAgICAgICAgICAgZ2xvYmFsVGhpcy5lbGVjdHJvbi55b3V0dWJlQ2hhdC5vbignY29tbWVudCcsIGZ1bmN0aW9uIChjb21tZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9hLCBfYjtcclxuICAgICAgICAgICAgICAgICAgICBlbGVjdHJvbl9sb2dfMS5kZWZhdWx0LmluZm8oJ1tZb3V0dWJlXSByZWNlaXZlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWdVcmwgPSAoX2IgPSAoX2EgPSBjb21tZW50LmF1dGhvci50aHVtYm5haWwpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS51cmwpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuYW1lID0gY29tbWVudC5hdXRob3IubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IGNvbW1lbnQubWVzc2FnZVswXS50ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbFRoaXMuZWxlY3Ryb24uY29tbWVudFF1ZXVlTGlzdC5wdXNoKHsgaW1nVXJsOiBpbWdVcmwsIG5hbWU6IG5hbWUsIHRleHQ6IHRleHQgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIOS9leOBi+OCqOODqeODvOOBjOOBguOBo+OBn1xyXG4gICAgICAgICAgICAgICAgZ2xvYmFsVGhpcy5lbGVjdHJvbi55b3V0dWJlQ2hhdC5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlY3Ryb25fbG9nXzEuZGVmYXVsdC5lcnJvcihcIltZb3V0dWJlIENoYXRdIGVycm9yIFwiICsgZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxvZy5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGdsb2JhbFRoaXMuZWxlY3Ryb24ueW91dHViZUNoYXQuc3RvcCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBnbG9iYWxUaGlzLmVsZWN0cm9uLnlvdXR1YmVDaGF0LnN0YXJ0KCldO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICB0dWJlUmVzdWx0ID0gX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCEhdHViZVJlc3VsdCkgcmV0dXJuIFszIC8qYnJlYWsqLywgM107XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB1dGlsXzEuc2xlZXAoNTAwMCldO1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICBzdGFydFlvdXR1YmVDaGF0KCk7XHJcbiAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDM7XHJcbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIFszIC8qYnJlYWsqLywgNV07XHJcbiAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgIGVfMiA9IF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgIC8vIOOBn+OBtuOCk+OBk+OBk+OBq+OBr+adpeOBquOBhFxyXG4gICAgICAgICAgICAgICAgZWxlY3Ryb25fbG9nXzEuZGVmYXVsdC5lcnJvcihlXzIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNV07XHJcbiAgICAgICAgICAgIGNhc2UgNTogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KTsgfTtcclxuLyoqXHJcbiAqIOOCteODvOODkOODvOWBnOatolxyXG4gKi9cclxuZWxlY3Ryb25fMS5pcGNNYWluLm9uKGNvbnN0XzEuZWxlY3Ryb25FdmVudFsnc3RvcC1zZXJ2ZXInXSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZygnW3N0YXJ0U2VydmVyXXNlcnZlciBzdG9wJyk7XHJcbiAgICBzZXJ2ZXIuY2xvc2UoKTtcclxuICAgIGFwcCA9IG51bGw7XHJcbiAgICBldmVudC5yZXR1cm5WYWx1ZSA9ICdzdG9wJztcclxuICAgIC8vIOOCreODpeODvOWHpueQhuWBnOatolxyXG4gICAgaXNFeGVjdXRlUXVlID0gZmFsc2U7XHJcbiAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLmNvbW1lbnRRdWV1ZUxpc3QgPSBbXTtcclxuICAgIC8vIOODrOOCueWPluW+l+OBruWBnOatolxyXG4gICAgdGhyZWFkSW50ZXJ2YWxFdmVudCA9IGZhbHNlO1xyXG4gICAgLy8gVHdpdGNo44OB44Oj44OD44OI44Gu5YGc5q2iXHJcbiAgICBpZiAoZ2xvYmFsVGhpcy5lbGVjdHJvbi50d2l0Y2hDaGF0KSB7XHJcbiAgICAgICAgZ2xvYmFsVGhpcy5lbGVjdHJvbi50d2l0Y2hDaGF0LmNsb3NlKCk7XHJcbiAgICAgICAgZ2xvYmFsVGhpcy5lbGVjdHJvbi50d2l0Y2hDaGF0LnJlbW92ZUFsbExpc3RlbmVycygpO1xyXG4gICAgfVxyXG4gICAgLy8gWW91dHViZeODgeODo+ODg+ODiOOBruWBnOatolxyXG4gICAgaWYgKGdsb2JhbFRoaXMuZWxlY3Ryb24ueW91dHViZUNoYXQpIHtcclxuICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLnlvdXR1YmVDaGF0LnN0b3AoKTtcclxuICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLnlvdXR1YmVDaGF0LnJlbW92ZUFsbExpc3RlbmVycygpO1xyXG4gICAgfVxyXG59KTtcclxudmFyIGdldFJlc0ludGVydmFsID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciByZXN1bHQ7XHJcbiAgICB2YXIgX2E7XHJcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9iKSB7XHJcbiAgICAgICAgc3dpdGNoIChfYi5sYWJlbCkge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBpZiAoIShnbG9iYWxUaGlzLmVsZWN0cm9uLnRocmVhZE51bWJlciA+IDApKSByZXR1cm4gWzMgLypicmVhayovLCAzXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGdldFJlc18xLmdldFJlcyhnbG9iYWxUaGlzLmNvbmZpZy51cmwsIGdsb2JhbFRoaXMuZWxlY3Ryb24udGhyZWFkTnVtYmVyKV07XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9iLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgIC8vIOaMh+WumuOBl+OBn+ODrOOCueeVquOBr+mZpOWkluWvvuixoVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDAgJiYgcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXS5udW1iZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLnRocmVhZE51bWJlciA9IE51bWJlcihyZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdLm51bWJlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgKF9hID0gZ2xvYmFsVGhpcy5lbGVjdHJvbi5jb21tZW50UXVldWVMaXN0KS5wdXNoLmFwcGx5KF9hLCByZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgbm90aWZ5VGhyZWFkUmVzTGltaXQoKV07XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIF9iLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgIF9iLmxhYmVsID0gMztcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aHJlYWRJbnRlcnZhbEV2ZW50KSByZXR1cm4gWzMgLypicmVhayovLCA1XTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHV0aWxfMS5zbGVlcChnbG9iYWxUaGlzLmNvbmZpZy5pbnRlcnZhbCAqIDEwMDApXTtcclxuICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgX2Iuc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgZ2V0UmVzSW50ZXJ2YWwoKTtcclxuICAgICAgICAgICAgICAgIF9iLmxhYmVsID0gNTtcclxuICAgICAgICAgICAgY2FzZSA1OiByZXR1cm4gWzIgLypyZXR1cm4qL107XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pOyB9O1xyXG4vKiog44Os44K555Wq44GM5LiK6ZmQ44GL44OB44Kn44OD44Kv44GX44Gm44CB6LaF44GI44Gm44Gf44KJ6YCa55+l44GZ44KLICovXHJcbnZhciBub3RpZnlUaHJlYWRSZXNMaW1pdCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBpZiAoIShnbG9iYWxUaGlzLmNvbmZpZy5ub3RpZnlUaHJlYWRSZXNMaW1pdCA+IDAgJiYgZ2xvYmFsVGhpcy5lbGVjdHJvbi50aHJlYWROdW1iZXIgPj0gZ2xvYmFsVGhpcy5jb25maWcubm90aWZ5VGhyZWFkUmVzTGltaXQpKSByZXR1cm4gWzMgLypicmVhayovLCAyXTtcclxuICAgICAgICAgICAgICAgIGdsb2JhbFRoaXMuZWxlY3Ryb24uY29tbWVudFF1ZXVlTGlzdC5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAndW5hY2FzdOOCiOOCiicsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1nVXJsOiAnLi9pbWcvdW5hY2FzdC5wbmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiXFx1MzBFQ1xcdTMwQjlcXHUzMDRDXCIgKyBnbG9iYWxUaGlzLmNvbmZpZy5ub3RpZnlUaHJlYWRSZXNMaW1pdCArIFwiXFx1MzA5MlxcdThEODVcXHUzMDQ4XFx1MzA3RVxcdTMwNTdcXHUzMDVGXFx1MzAwMlxcdTZCMjFcXHUzMEI5XFx1MzBFQ1xcdTMwOTJcXHU3QUNCXFx1MzA2NlxcdTMwNjZcXHUzMDRGXFx1MzA2MFxcdTMwNTVcXHUzMDQ0XFx1MzAwMlwiLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvLyDmrKHjgrnjg6zmpJzntKLjg53jg7zjg6rjg7PjgrDlh6bnkIbjgpLotbDjgonjgZvjgotcclxuICAgICAgICAgICAgICAgIC8vIOOCueODrOeri+OBpuS4reOBoOOBqOaAneOBhuOBruOBp+OBoeOCh+OBo+OBqOW+heOBpFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdXRpbF8xLnNsZWVwKDEwICogMTAwMCldO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAvLyDmrKHjgrnjg6zmpJzntKLjg53jg7zjg6rjg7PjgrDlh6bnkIbjgpLotbDjgonjgZvjgotcclxuICAgICAgICAgICAgICAgIC8vIOOCueODrOeri+OBpuS4reOBoOOBqOaAneOBhuOBruOBp+OBoeOCh+OBo+OBqOW+heOBpFxyXG4gICAgICAgICAgICAgICAgX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSAyO1xyXG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBbMiAvKnJldHVybiovXTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSk7IH07XHJcbi8qKlxyXG4gKiDjgq3jg6Xjg7zjgavmupzjgb7jgaPjgZ/jgrPjg6Hjg7Pjg4jjgpLlh6bnkIbjgZnjgotcclxuICovXHJcbnZhciB0YXNrU2NoZWR1bGVyID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB0ZW1wLCBjb21tZW50O1xyXG4gICAgdmFyIF9hLCBfYjtcclxuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2MpIHtcclxuICAgICAgICBzd2l0Y2ggKF9jLmxhYmVsKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIGlmICghKCgoX2IgPSAoX2EgPSBnbG9iYWxUaGlzLmVsZWN0cm9uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY29tbWVudFF1ZXVlTGlzdCkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmxlbmd0aCkgPiAwKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgM107XHJcbiAgICAgICAgICAgICAgICBpZiAoIShnbG9iYWxUaGlzLmNvbmZpZy5jb21tZW50UHJvY2Vzc1R5cGUgPT09IDApKSByZXR1cm4gWzMgLypicmVhayovLCAxXTtcclxuICAgICAgICAgICAgICAgIHRlbXAgPSBfX3NwcmVhZEFycmF5cyhnbG9iYWxUaGlzLmVsZWN0cm9uLmNvbW1lbnRRdWV1ZUxpc3QpO1xyXG4gICAgICAgICAgICAgICAgZ2xvYmFsVGhpcy5lbGVjdHJvbi5jb21tZW50UXVldWVMaXN0ID0gW107XHJcbiAgICAgICAgICAgICAgICAvLyDmlrDnnYDjgYzkuIrjga7loLTlkIjjga/pgIbpoIbjgavjgZnjgotcclxuICAgICAgICAgICAgICAgIGlmICghZ2xvYmFsVGhpcy5jb25maWcuZGlzcFNvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wID0gdGVtcC5yZXZlcnNlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzZW5kRG9tKHRlbXApO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgM107XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIGNvbW1lbnQgPSBnbG9iYWxUaGlzLmVsZWN0cm9uLmNvbW1lbnRRdWV1ZUxpc3Quc2hpZnQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHNlbmREb20oW2NvbW1lbnRdKV07XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIF9jLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgIF9jLmxhYmVsID0gMztcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgaWYgKCFpc0V4ZWN1dGVRdWUpIHJldHVybiBbMyAvKmJyZWFrKi8sIDVdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgdXRpbF8xLnNsZWVwKDEwMCldO1xyXG4gICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICBfYy5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICB0YXNrU2NoZWR1bGVyKCk7XHJcbiAgICAgICAgICAgICAgICBfYy5sYWJlbCA9IDU7XHJcbiAgICAgICAgICAgIGNhc2UgNTogcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KTsgfTtcclxuLyoqIOiqreOBv+WtkOOBq+OCiOOBo+OBpueZuuipseS4reOBp+OBguOCi+OBiyAqL1xyXG52YXIgaXNTcGVha2luZyA9IGZhbHNlO1xyXG4vKiog6Kqt44G/5a2Q44KS5YaN55Sf44GZ44KLICovXHJcbnZhciBwbGF5WW9taWtvID0gZnVuY3Rpb24gKG1zZykgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIC8vIGxvZy5pbmZvKCdbcGxheVlvbWlrb10gc3RhcnQnKTtcclxuICAgICAgICAgICAgICAgIGlzU3BlYWtpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgLy8g6Kqt44G/5a2Q5ZG844Gz5Ye644GXXHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGNvbmZpZy50eXBlWW9taWtvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAndGFtaXlhc3UnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkX3Byb2Nlc3NfMS5leGVjKGNvbmZpZy50YW1peWFzdVBhdGggKyBcIiBcIiArIG1zZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXNlICdib3V5b21pJzoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYm91eW9taSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdXlvbWkuc3BlYWsobXNnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8g6Kqt44G/5a2Q44GM6Kqt44KT44Gn44KL5pmC6ZaT5YiG55u45b2T5b6F44GkXHJcbiAgICAgICAgICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLm1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZChjb25zdF8xLmVsZWN0cm9uRXZlbnRbJ3dhaXQteW9taWtvLXRpbWUnXSwgbXNnKTtcclxuICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMTtcclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgaWYgKCFpc1NwZWFraW5nKSByZXR1cm4gWzMgLypicmVhayovLCAzXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHV0aWxfMS5zbGVlcCg1MCldO1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCAxXTtcclxuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzIgLypyZXR1cm4qL107XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pOyB9O1xyXG5lbGVjdHJvbl8xLmlwY01haW4ub24oY29uc3RfMS5lbGVjdHJvbkV2ZW50WydzcGVha2luZy1lbmQnXSwgZnVuY3Rpb24gKGV2ZW50KSB7IHJldHVybiAoaXNTcGVha2luZyA9IGZhbHNlKTsgfSk7XHJcbnZhciBpc1BsYXlpbmdTZSA9IGZhbHNlO1xyXG52YXIgcGxheVNlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB3YXZmaWxlcGF0aDtcclxuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIHdhdmZpbGVwYXRoID0gZ2xvYmFsVGhpcy5lbGVjdHJvbi5zZUxpc3RbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ2xvYmFsVGhpcy5lbGVjdHJvbi5zZUxpc3QubGVuZ3RoKV07XHJcbiAgICAgICAgICAgICAgICBpc1BsYXlpbmdTZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLm1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZChjb25zdF8xLmVsZWN0cm9uRXZlbnRbJ3BsYXktc291bmQtc3RhcnQnXSwgd2F2ZmlsZXBhdGgpO1xyXG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzUGxheWluZ1NlKSByZXR1cm4gWzMgLypicmVhayovLCAzXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHV0aWxfMS5zbGVlcCg1MCldO1xyXG4gICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCAxXTtcclxuICAgICAgICAgICAgY2FzZSAzOiByZXR1cm4gWzIgLypyZXR1cm4qL107XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pOyB9O1xyXG5lbGVjdHJvbl8xLmlwY01haW4ub24oY29uc3RfMS5lbGVjdHJvbkV2ZW50WydwbGF5LXNvdW5kLWVuZCddLCBmdW5jdGlvbiAoZXZlbnQpIHsgcmV0dXJuIChpc1BsYXlpbmdTZSA9IGZhbHNlKTsgfSk7XHJcbmV4cG9ydHMuY3JlYXRlRG9tID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgIHZhciBkb21TdHIgPSBcIlxcbiAgPGxpIGNsYXNzPVxcXCJsaXN0LWl0ZW1cXFwiPlxcbiAgICA8c3BhbiBjbGFzcz1cXFwiaWNvbi1ibG9ja1xcXCI+XFxuICAgICAgPGltZyBjbGFzcz1cXFwiaWNvblxcXCIgc3JjPVxcXCJcIiArIG1lc3NhZ2UuaW1nVXJsICsgXCJcXFwiPlxcbiAgICA8L3NwYW4+XFxuICA8ZGl2IGNsYXNzPVxcXCJjb250ZW50XFxcIj5cIjtcclxuICAgIHZhciBpc1Jlc05hbWVTaG93ZWQgPSBmYWxzZTtcclxuICAgIC8vIOODrOOCueeVquihqOekulxyXG4gICAgaWYgKGdsb2JhbFRoaXMuY29uZmlnLnNob3dOdW1iZXIgJiYgbWVzc2FnZS5udW1iZXIpIHtcclxuICAgICAgICBkb21TdHIgKz0gXCJcXG4gICAgICA8c3BhbiBjbGFzcz1cXFwicmVzTnVtYmVyXFxcIj5cIiArIG1lc3NhZ2UubnVtYmVyICsgXCI8L3NwYW4+XFxuICAgIFwiO1xyXG4gICAgICAgIGlzUmVzTmFtZVNob3dlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICAvLyDlkI3liY3ooajnpLpcclxuICAgIGlmIChnbG9iYWxUaGlzLmNvbmZpZy5zaG93TmFtZSAmJiBtZXNzYWdlLm5hbWUpIHtcclxuICAgICAgICBkb21TdHIgKz0gXCI8c3BhbiBjbGFzcz1cXFwibmFtZVxcXCI+XCIgKyBtZXNzYWdlLm5hbWUgKyBcIjwvc3Bhbj5cIjtcclxuICAgICAgICBpc1Jlc05hbWVTaG93ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgLy8g5pmC5Yi76KGo56S6XHJcbiAgICBpZiAoZ2xvYmFsVGhpcy5jb25maWcuc2hvd1RpbWUgJiYgbWVzc2FnZS5kYXRlKSB7XHJcbiAgICAgICAgZG9tU3RyICs9IFwiPHNwYW4gY2xhc3M9XFxcImRhdGVcXFwiPlwiICsgbWVzc2FnZS5kYXRlICsgXCI8L3NwYW4+XCI7XHJcbiAgICAgICAgaXNSZXNOYW1lU2hvd2VkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIC8vIOWQjeWJjeOBqOacrOaWh+OCkuaUueihjOOBp+WIhuOBkeOCi1xyXG4gICAgLy8g5ZCN5YmN44KE5pmC5Yi744Gu6KGM44GM5LiA44Gk44KC54Sh44GR44KM44Gw44CB5pS56KGM44GX44Gq44GEXHJcbiAgICBpZiAoZ2xvYmFsVGhpcy5jb25maWcubmV3TGluZSAmJiBpc1Jlc05hbWVTaG93ZWQpIHtcclxuICAgICAgICBkb21TdHIgKz0gJzxiciAvPic7XHJcbiAgICB9XHJcbiAgICBkb21TdHIgKz0gXCJcXG4gICAgPHNwYW4gY2xhc3M9XFxcInJlc1xcXCI+XFxuICAgICAgXCIgKyBtZXNzYWdlLnRleHQgKyBcIlxcbiAgICA8L3NwYW4+XFxuICAgIDwvZGl2PlxcbiAgPC9saT5cIjtcclxuICAgIHJldHVybiBkb21TdHI7XHJcbn07XHJcbi8qKlxyXG4gKiDjgrPjg6Hjg7Pjg4jjga5ET03jgpLjg5bjg6njgqbjgrbjgavpgIHjgotcclxuICog5b+F6KaB44Gq44KJ44Os44K5552A5L+h6Z+z44KC6bO044KJ44GZXHJcbiAqIEBwYXJhbSBtZXNzYWdlXHJcbiAqL1xyXG52YXIgc2VuZERvbSA9IGZ1bmN0aW9uIChtZXNzYWdlTGlzdCkgeyByZXR1cm4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBkb21TdHIsIGRvbVN0cjIsIGVfMztcclxuICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcclxuICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMCwgNSwgLCA2XSk7XHJcbiAgICAgICAgICAgICAgICBkb21TdHIgPSBtZXNzYWdlTGlzdC5tYXAoZnVuY3Rpb24gKG1lc3NhZ2UpIHsgcmV0dXJuIGV4cG9ydHMuY3JlYXRlRG9tKG1lc3NhZ2UpOyB9KS5qb2luKCdcXG4nKTtcclxuICAgICAgICAgICAgICAgIGlmIChnbG9iYWxUaGlzLmVsZWN0cm9uLnNvY2tldClcclxuICAgICAgICAgICAgICAgICAgICBnbG9iYWxUaGlzLmVsZWN0cm9uLnNvY2tldC5zZW5kKGRvbVN0cik7XHJcbiAgICAgICAgICAgICAgICBkb21TdHIyID0gbWVzc2FnZUxpc3RcclxuICAgICAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltZ1VybCA9IG1lc3NhZ2UuaW1nVXJsICYmIG1lc3NhZ2UuaW1nVXJsLm1hdGNoKC9eXFwuLykgPyAnLi4vLi4vcHVibGljLycgKyBtZXNzYWdlLmltZ1VybCA6IG1lc3NhZ2UuaW1nVXJsO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgbWVzc2FnZSksIHsgaW1nVXJsOiBpbWdVcmwgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKG1lc3NhZ2UpIHsgcmV0dXJuIGV4cG9ydHMuY3JlYXRlRG9tKG1lc3NhZ2UpOyB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKCdcXG4nKTtcclxuICAgICAgICAgICAgICAgIGdsb2JhbFRoaXMuZWxlY3Ryb24uY2hhdFdpbmRvdy53ZWJDb250ZW50cy5zZW5kKGNvbnN0XzEuZWxlY3Ryb25FdmVudFsnc2hvdy1jb21tZW50J10sIHsgY29uZmlnOiBnbG9iYWxUaGlzLmNvbmZpZywgZG9tOiBkb21TdHIyIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCEoY29uZmlnLnBsYXlTZSAmJiBnbG9iYWxUaGlzLmVsZWN0cm9uLnNlTGlzdC5sZW5ndGggPiAwKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgMl07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBwbGF5U2UoKV07XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMjtcclxuICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgaWYgKCEoZ2xvYmFsVGhpcy5jb25maWcudHlwZVlvbWlrbyAhPT0gJ25vbmUnKSkgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCBwbGF5WW9taWtvKG1lc3NhZ2VMaXN0W21lc3NhZ2VMaXN0Lmxlbmd0aCAtIDFdLnRleHQpXTtcclxuICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgX2Euc2VudCgpO1xyXG4gICAgICAgICAgICAgICAgX2EubGFiZWwgPSA0O1xyXG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMyAvKmJyZWFrKi8sIDZdO1xyXG4gICAgICAgICAgICBjYXNlIDU6XHJcbiAgICAgICAgICAgICAgICBlXzMgPSBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICBlbGVjdHJvbl9sb2dfMS5kZWZhdWx0LmVycm9yKGVfMyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA2XTtcclxuICAgICAgICAgICAgY2FzZSA2OiByZXR1cm4gWzIgLypyZXR1cm4qL107XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pOyB9O1xyXG5leHBvcnRzLmRlZmF1bHQgPSB7fTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGZzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImZzXCIpKTtcclxuZXhwb3J0cy5yZWFkV2F2RmlsZXMgPSBmdW5jdGlvbiAocGF0aCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmc18xLmRlZmF1bHQucmVhZGRpcihwYXRoLCBmdW5jdGlvbiAoZXJyLCBmaWxlcykge1xyXG4gICAgICAgICAgICBpZiAoZXJyKVxyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgIHZhciBmaWxlTGlzdCA9IGZpbGVzLmZpbHRlcihmdW5jdGlvbiAoZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzRXhpc3RGaWxlKHBhdGggKyAnLycgKyBmaWxlKSAmJiAvLipcXC53YXYkLy50ZXN0KGZpbGUpOyAvL+e1nuOCiui+vOOBv1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmVzb2x2ZShmaWxlTGlzdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxudmFyIGlzRXhpc3RGaWxlID0gZnVuY3Rpb24gKGZpbGUpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgZnNfMS5kZWZhdWx0LnN0YXRTeW5jKGZpbGUpLmlzRmlsZSgpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGlmIChlcnIuY29kZSA9PT0gJ0VOT0VOVCcpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufTtcclxuZXhwb3J0cy5zbGVlcCA9IGZ1bmN0aW9uIChtc2VjKSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXR1cm4gc2V0VGltZW91dChyZXNvbHZlLCBtc2VjKTsgfSk7IH07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBsaXZlX2NoYXRfMSA9IHJlcXVpcmUoXCIuL2xpdmUtY2hhdFwiKTtcclxuZXhwb3J0cy5MaXZlQ2hhdCA9IGxpdmVfY2hhdF8xLkxpdmVDaGF0O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufTtcclxudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59O1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBldmVudHNfMSA9IHJlcXVpcmUoXCJldmVudHNcIik7XHJcbnZhciBheGlvc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJheGlvc1wiKSk7XHJcbnZhciBwYXJzZXJfMSA9IHJlcXVpcmUoXCIuL3BhcnNlclwiKTtcclxuLyoqXHJcbiAqIFlvdVR1YmXjg6njgqTjg5bjg4Hjg6Pjg4Pjg4jlj5blvpfjgqTjg5njg7Pjg4hcclxuICovXHJcbnZhciBMaXZlQ2hhdCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhMaXZlQ2hhdCwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIExpdmVDaGF0KG9wdGlvbnMsIGludGVydmFsKSB7XHJcbiAgICAgICAgaWYgKGludGVydmFsID09PSB2b2lkIDApIHsgaW50ZXJ2YWwgPSAxMDAwOyB9XHJcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcclxuICAgICAgICBfdGhpcy5pbnRlcnZhbCA9IGludGVydmFsO1xyXG4gICAgICAgIF90aGlzLnByZXZUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgICAgICBpZiAoJ2NoYW5uZWxJZCcgaW4gb3B0aW9ucykge1xyXG4gICAgICAgICAgICBfdGhpcy5jaGFubmVsSWQgPSBvcHRpb25zLmNoYW5uZWxJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoJ2xpdmVJZCcgaW4gb3B0aW9ucykge1xyXG4gICAgICAgICAgICBfdGhpcy5saXZlSWQgPSBvcHRpb25zLmxpdmVJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IFR5cGVFcnJvcignUmVxdWlyZWQgY2hhbm5lbElkIG9yIGxpdmVJZC4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIF90aGlzO1xyXG4gICAgfVxyXG4gICAgTGl2ZUNoYXQucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHVybCwgbGl2ZVJlcywgZV8xO1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY2hhbm5lbElkKSByZXR1cm4gWzMgLypicmVhayovLCA0XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9jaGFubmVsL1wiICsgdGhpcy5jaGFubmVsSWQgKyBcIi9saXZlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hLnRyeXMucHVzaChbMSwgMywgLCA0XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIGF4aW9zXzEuZGVmYXVsdC5nZXQodXJsLCB7IGhlYWRlcnM6IExpdmVDaGF0LmhlYWRlcnMgfSldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGl2ZVJlcyA9IF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICBpZiAobGl2ZVJlcy5kYXRhLm1hdGNoKC9MSVZFX1NUUkVBTV9PRkZMSU5FLykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoJ0xpdmUgc3RyZWFtIG9mZmxpbmUnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxpdmVJZCA9IGxpdmVSZXMuZGF0YS5tYXRjaCgvdmlkZW9JZFxcXFxcIjpcXFxcXCIoLis/KVxcXFwvKVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgNF07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlXzEgPSBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCBuZXcgRXJyb3IoXCJjb25uZWN0aW9uIGVycm9yIHVybCA9IFwiICsgdXJsKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBmYWxzZV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMubGl2ZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdMaXZlIHN0cmVhbSBub3QgZm91bmQnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgZmFsc2VdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGBsaXZlSWQgPSAke3RoaXMubGl2ZUlkfWApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9ic2VydmVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMuZmV0Y2hDaGF0KCk7IH0sIHRoaXMuaW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3N0YXJ0JywgdGhpcy5saXZlSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzIgLypyZXR1cm4qLywgdHJ1ZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIExpdmVDaGF0LnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKHJlYXNvbikge1xyXG4gICAgICAgIGlmICh0aGlzLm9ic2VydmVyKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5vYnNlcnZlcik7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnZW5kJywgcmVhc29uKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgTGl2ZUNoYXQucHJvdG90eXBlLmZldGNoQ2hhdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB1cmwsIHJlcywgaXRlbXMsIGl0ZW0sIGVfMjtcclxuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChfYS5sYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsID0gXCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9saXZlX2NoYXQ/dj1cIiArIHRoaXMubGl2ZUlkICsgXCImcGJqPTFcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2EudHJ5cy5wdXNoKFsxLCAzLCAsIDRdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFs0IC8qeWllbGQqLywgYXhpb3NfMS5kZWZhdWx0LmdldCh1cmwsIHsgaGVhZGVyczogTGl2ZUNoYXQuaGVhZGVycyB9KV07XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgPSBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gcmVzLmRhdGFbMV0ucmVzcG9uc2UuY29udGVudHMubGl2ZUNoYXRSZW5kZXJlci5hY3Rpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc2xpY2UoMCwgLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZVJlbmRlcmVyID0gcGFyc2VyXzEuYWN0aW9uVG9SZW5kZXJlcih2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlUmVuZGVyZXIgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobWVzc2FnZVJlbmRlcmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZXJfMS51c2VjVG9UaW1lKG1lc3NhZ2VSZW5kZXJlci50aW1lc3RhbXBVc2VjKSA+IF90aGlzLnByZXZUaW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHBhcnNlcl8xLnBhcnNlRGF0YSh2KTsgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuZW1pdCgnY29tbWVudCcsIHYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBpdGVtc1tpdGVtcy5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJldlRpbWUgPSBpdGVtLnRpbWVzdGFtcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA0XTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVfMiA9IF9hLnNlbnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcihcIkVycm9yIG9jY3VyZWQgYXQgZmV0Y2hjaGF0IHVybD1cIiArIHVybCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMgLypicmVhayovLCA0XTtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMiAvKnJldHVybiovXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgTGl2ZUNoYXQucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2ZW50LCBsaXN0ZW5lcikge1xyXG4gICAgICAgIHJldHVybiBfc3VwZXIucHJvdG90eXBlLm9uLmNhbGwodGhpcywgZXZlbnQsIGxpc3RlbmVyKTtcclxuICAgIH07XHJcbiAgICBMaXZlQ2hhdC5oZWFkZXJzID0geyAndXNlci1hZ2VudCc6ICdNb3ppbGxhLzUuMCAoV2luZG93cyBOVCAxMC4wOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvNzUuMC4zNzcwLjE0MiBTYWZhcmkvNTM3LjM2JyB9O1xyXG4gICAgcmV0dXJuIExpdmVDaGF0O1xyXG59KGV2ZW50c18xLkV2ZW50RW1pdHRlcikpO1xyXG5leHBvcnRzLkxpdmVDaGF0ID0gTGl2ZUNoYXQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBwYXJzZVRodW1ibmFpbFRvSW1hZ2VJdGVtID0gZnVuY3Rpb24gKGRhdGEsIGFsdCkge1xyXG4gICAgdmFyIHRodW1ibmFpbCA9IGRhdGEucG9wKCk7XHJcbiAgICBpZiAodGh1bWJuYWlsKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdXJsOiB0aHVtYm5haWwudXJsLFxyXG4gICAgICAgICAgICB3aWR0aDogdGh1bWJuYWlsLndpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRodW1ibmFpbC5oZWlnaHQsXHJcbiAgICAgICAgICAgIGFsdDogYWx0LFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm47XHJcbn07XHJcbnZhciBwYXJzZUVtb2ppVG9JbWFnZUl0ZW0gPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgcmV0dXJuIHBhcnNlVGh1bWJuYWlsVG9JbWFnZUl0ZW0oZGF0YS5lbW9qaS5pbWFnZS50aHVtYm5haWxzLCBkYXRhLmVtb2ppLnNob3J0Y3V0cy5zaGlmdCgpKTtcclxufTtcclxudmFyIHBhcnNlTWVzc2FnZXMgPSBmdW5jdGlvbiAocnVucykge1xyXG4gICAgcmV0dXJuIHJ1bnMubWFwKGZ1bmN0aW9uIChydW4pIHtcclxuICAgICAgICBpZiAoJ3RleHQnIGluIHJ1bikge1xyXG4gICAgICAgICAgICByZXR1cm4gcnVuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRW1vamlUb0ltYWdlSXRlbShydW4pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG5leHBvcnRzLmFjdGlvblRvUmVuZGVyZXIgPSBmdW5jdGlvbiAoYWN0aW9uKSB7XHJcbiAgICBpZiAoIWFjdGlvbi5hZGRDaGF0SXRlbUFjdGlvbikge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgdmFyIGl0ZW0gPSBhY3Rpb24uYWRkQ2hhdEl0ZW1BY3Rpb24uaXRlbTtcclxuICAgIGlmIChpdGVtLmxpdmVDaGF0VGV4dE1lc3NhZ2VSZW5kZXJlcikge1xyXG4gICAgICAgIHJldHVybiBpdGVtLmxpdmVDaGF0VGV4dE1lc3NhZ2VSZW5kZXJlcjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGl0ZW0ubGl2ZUNoYXRQYWlkTWVzc2FnZVJlbmRlcmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIGl0ZW0ubGl2ZUNoYXRQYWlkTWVzc2FnZVJlbmRlcmVyO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXRlbS5saXZlQ2hhdFBhaWRTdGlja2VyUmVuZGVyZXIpIHtcclxuICAgICAgICByZXR1cm4gaXRlbS5saXZlQ2hhdFBhaWRTdGlja2VyUmVuZGVyZXI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gaXRlbS5saXZlQ2hhdE1lbWJlcnNoaXBJdGVtUmVuZGVyZXI7XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMudXNlY1RvVGltZSA9IGZ1bmN0aW9uICh1c2VjKSB7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihOdW1iZXIodXNlYykgLyAxMDAwKTtcclxufTtcclxuZXhwb3J0cy5wYXJzZURhdGEgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgdmFyIG1lc3NhZ2VSZW5kZXJlciA9IGV4cG9ydHMuYWN0aW9uVG9SZW5kZXJlcihkYXRhKTtcclxuICAgIGlmIChtZXNzYWdlUmVuZGVyZXIgPT09IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHZhciBtZXNzYWdlID0gW107XHJcbiAgICBpZiAoJ21lc3NhZ2UnIGluIG1lc3NhZ2VSZW5kZXJlcikge1xyXG4gICAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlUmVuZGVyZXIubWVzc2FnZS5ydW5zO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoJ2hlYWRlclN1YnRleHQnIGluIG1lc3NhZ2VSZW5kZXJlcikge1xyXG4gICAgICAgIG1lc3NhZ2UgPSBtZXNzYWdlUmVuZGVyZXIuaGVhZGVyU3VidGV4dC5ydW5zO1xyXG4gICAgfVxyXG4gICAgdmFyIHJldCA9IHtcclxuICAgICAgICBpZDogbWVzc2FnZVJlbmRlcmVyLmlkLFxyXG4gICAgICAgIGF1dGhvcjoge1xyXG4gICAgICAgICAgICBuYW1lOiBtZXNzYWdlUmVuZGVyZXIuYXV0aG9yTmFtZS5zaW1wbGVUZXh0LFxyXG4gICAgICAgICAgICB0aHVtYm5haWw6IHBhcnNlVGh1bWJuYWlsVG9JbWFnZUl0ZW0obWVzc2FnZVJlbmRlcmVyLmF1dGhvclBob3RvLnRodW1ibmFpbHMsIG1lc3NhZ2VSZW5kZXJlci5hdXRob3JOYW1lLnNpbXBsZVRleHQpLFxyXG4gICAgICAgICAgICBjaGFubmVsSWQ6IG1lc3NhZ2VSZW5kZXJlci5hdXRob3JFeHRlcm5hbENoYW5uZWxJZCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2U6IHBhcnNlTWVzc2FnZXMobWVzc2FnZSksXHJcbiAgICAgICAgbWVtYmVyc2hpcDogQm9vbGVhbignaGVhZGVyU3VidGV4dCcgaW4gbWVzc2FnZVJlbmRlcmVyKSxcclxuICAgICAgICBpc093bmVyOiBmYWxzZSxcclxuICAgICAgICB0aW1lc3RhbXA6IGV4cG9ydHMudXNlY1RvVGltZShtZXNzYWdlUmVuZGVyZXIudGltZXN0YW1wVXNlYyksXHJcbiAgICB9O1xyXG4gICAgaWYgKG1lc3NhZ2VSZW5kZXJlci5hdXRob3JCYWRnZXMpIHtcclxuICAgICAgICB2YXIgYmFkZ2UgPSBtZXNzYWdlUmVuZGVyZXIuYXV0aG9yQmFkZ2VzWzBdLmxpdmVDaGF0QXV0aG9yQmFkZ2VSZW5kZXJlcjtcclxuICAgICAgICBpZiAoYmFkZ2UuY3VzdG9tVGh1bWJuYWlsKSB7XHJcbiAgICAgICAgICAgIHJldC5hdXRob3IuYmFkZ2UgPSB7XHJcbiAgICAgICAgICAgICAgICB0aHVtYm5haWw6IHBhcnNlVGh1bWJuYWlsVG9JbWFnZUl0ZW0oYmFkZ2UuY3VzdG9tVGh1bWJuYWlsLnRodW1ibmFpbHMsIGJhZGdlLnRvb2x0aXApLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IGJhZGdlLnRvb2x0aXAsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXQuaXNPd25lciA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCdzdGlja2VyJyBpbiBtZXNzYWdlUmVuZGVyZXIpIHtcclxuICAgICAgICByZXQuc3VwZXJjaGF0ID0ge1xyXG4gICAgICAgICAgICBhbW91bnQ6IG1lc3NhZ2VSZW5kZXJlci5wdXJjaGFzZUFtb3VudFRleHQuc2ltcGxlVGV4dCxcclxuICAgICAgICAgICAgY29sb3I6IG1lc3NhZ2VSZW5kZXJlci5iYWNrZ3JvdW5kQ29sb3IsXHJcbiAgICAgICAgICAgIHN0aWNrZXI6IHBhcnNlVGh1bWJuYWlsVG9JbWFnZUl0ZW0obWVzc2FnZVJlbmRlcmVyLnN0aWNrZXIudGh1bWJuYWlscywgbWVzc2FnZVJlbmRlcmVyLnN0aWNrZXIuYWNjZXNzaWJpbGl0eS5hY2Nlc3NpYmlsaXR5RGF0YS5sYWJlbCksXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKCdwdXJjaGFzZUFtb3VudFRleHQnIGluIG1lc3NhZ2VSZW5kZXJlcikge1xyXG4gICAgICAgIHJldC5zdXBlcmNoYXQgPSB7XHJcbiAgICAgICAgICAgIGFtb3VudDogbWVzc2FnZVJlbmRlcmVyLnB1cmNoYXNlQW1vdW50VGV4dC5zaW1wbGVUZXh0LFxyXG4gICAgICAgICAgICBjb2xvcjogbWVzc2FnZVJlbmRlcmVyLmJvZHlCYWNrZ3JvdW5kQ29sb3IsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXQ7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImF4aW9zXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJvZHktcGFyc2VyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNoaWxkX3Byb2Nlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZGFuay10d2l0Y2gtaXJjXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLWxvZ1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJldmVudHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzLXdzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImljb252LWxpdGVcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibmV0XCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7Il0sInNvdXJjZVJvb3QiOiIifQ==