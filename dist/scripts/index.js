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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/renderer/renderer.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/renderer/renderer.js":
/*!**********************************!*\
  !*** ./src/renderer/renderer.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const ipcRenderer = __webpack_require__(/*! electron */ \"electron\").ipcRenderer;\r\n\r\n\r\ndocument.addEventListener(\"DOMContentLoaded\", () => {\r\n  console.log(\"[renderer.js]DOM Content Loaded\");\r\n  //設定のロード\r\n  loadConfigToLocalStrage();\r\n  //停止確認ダイアログ\r\n  var dialog = document.getElementById('close-dialog');\r\n  //dialogエレメントに対応していないブラウザ用、なんだけどElectronはChromiumなんでいらない\r\n  //if (! dialog.showModal) {\r\n    //dialogPolyfill.registerDialog(dialog); //これ使うならdialogPolyfill.cssとjsが必要\r\n  //}\r\n\r\n  //起動・停止ボタン\r\n  var startButton = document.getElementById('button-server-start');\r\n  var stopButton = document.getElementById('button-server-stop');\r\n  var closeOkButton = document.getElementById('button-close-dialog-ok');\r\n  var closeCancelButton = document.getElementById('button-close-dialog-cancel');\r\n\r\n  //サーバーのON-OFFする\r\n  startButton.onclick = (event) => {\r\n    //サーバー起動\r\n    //設定情報取得\r\n    var config = buildConfigJson();\r\n    console.log('[renderer.js]config=')\r\n    console.log(config);\r\n    //設定情報をローカルストレージへ保存\r\n    saveConfigToLocalStrage(config);\r\n\r\n    //URLとポートを指定していない場合はエラー\r\n    if((config.url === null || config.url.length < 1)\r\n    || (config.port === null || config.port.length < 1))\r\n    {\r\n      return;\r\n    }\r\n\r\n    // サーバー開始メッセージを送信する\r\n    var result = ipcRenderer.sendSync('start-server', config);\r\n    console.log('[renderer.js]' + result);\r\n    // サーバー起動・停止ボタン状態変更\r\n    stopButton.disabled = false;\r\n    startButton.disabled = true;\r\n    return;\r\n  }\r\n  //サーバー停止ボタン\r\n  stopButton.onclick = (event) => {\r\n    var config = buildConfigJson();\r\n    //設定情報をローカルストレージへ保存\r\n    saveConfigToLocalStrage(config);\r\n\r\n    //確認ダイアログを表示\r\n    dialog.showModal();\r\n  }\r\n\r\n  closeOkButton.onclick = (event) => {\r\n    var result = ipcRenderer.sendSync('stop-server');\r\n    console.log('[renderer.js]' + result);\r\n    //ダイアログクローズ\r\n    dialog.close();\r\n    // サーバー起動・停止ボタン状態変更\r\n    startButton.disabled = false;\r\n    stopButton.disabled = true;\r\n    return;\r\n  }\r\n  closeCancelButton.onclick = (event) => {\r\n    //ダイアログクローズ\r\n    dialog.close();\r\n    return;\r\n  }\r\n\r\n});\r\n\r\n//サーバー起動用のパラメータを作成する\r\nfunction buildConfigJson() {\r\n  //画面から各種項目を取得する\r\n  var url = document.getElementById(\"text-url\").value;\r\n  var resNumber = document.getElementById(\"text-res-number\").value;\r\n  var noname = document.getElementById(\"text-noname\").value;\r\n  var initMessage = document.getElementById(\"text-init-message\").value;\r\n  var port = parseInt(document.getElementById(\"text-port-number\").value);\r\n  var dispNumber = document.getElementById(\"text-disp-number\").value;\r\n  var interval = document.getElementById(\"rangeSpan\").value;\r\n  var youtubeUrl = document.getElementById(\"text-youtube-url\").value;\r\n\r\n  //レス番表示設定\r\n  var showNumber = 0;\r\n  if(document.getElementById(\"checkbox-showNumber\").checked == true){\r\n    showNumber = 1;\r\n  }\r\n  //名前表示設定\r\n  var showName = 0;\r\n  if(document.getElementById(\"checkbox-showName\").checked == true){\r\n    showName = 1;\r\n  }\r\n  //時刻表示設定\r\n  var showTime = 0;\r\n  if(document.getElementById(\"checkbox-showTime\").checked == true){\r\n    showTime = 1;\r\n  }\r\n\r\n  //自動改行設定\r\n  var wordBreak = 0;\r\n  if(document.getElementById(\"checkbox-wordBreak\").checked == true){\r\n    wordBreak = 1;\r\n  }\r\n\r\n  //表示順序設定\r\n  var dispSort = 0;\r\n  if(document.getElementById(\"newResUp\").checked == true){\r\n    dispSort = 0;\r\n  }else{\r\n    dispSort = 1;\r\n  }\r\n\r\n  //本文改行設定\r\n  var newLine = 0;\r\n  if(document.getElementById(\"disableNewLine\").checked == true){\r\n    newLine = 0;\r\n  }else{\r\n    newLine = 1;\r\n  }\r\n\r\n  var config = {\r\n    \"url\": url,\r\n    \"resNumber\": resNumber,\r\n    \"noname\": noname,\r\n    \"initMessage\": initMessage,\r\n    \"port\": port,\r\n    \"dipsNumber\": dispNumber,\r\n    \"interval\": interval,\r\n    \"youtubeUrl\": youtubeUrl,\r\n    \"dispSort\": dispSort,\r\n    \"newLine\": newLine,\r\n    \"showNumber\": showNumber,\r\n    \"showName\": showName,\r\n    \"showTime\": showTime,\r\n    \"wordBreak\": wordBreak\r\n\r\n  }\r\n\r\n  return config;\r\n};\r\n\r\n/**\r\n* 設定をローカルストレージへ保存する\r\n* サーバー起動時に呼び出される\r\n**/\r\nfunction saveConfigToLocalStrage(config){\r\n  localStorage.setItem('url', config.url);\r\n  localStorage.setItem('resNumber', config.resNumber);\r\n  localStorage.setItem('noname', config.noname);\r\n  localStorage.setItem('initMessage', config.initMessage);\r\n  localStorage.setItem('port', config.port);\r\n  localStorage.setItem('dipsNumber', config.dipsNumber);\r\n  localStorage.setItem('interval', config.interval);\r\n  localStorage.setItem('youtubeUrl', config.youtubeUrl);\r\n  localStorage.setItem('dispSort', config.dispSort);\r\n  localStorage.setItem('newLine', config.newLine);\r\n  localStorage.setItem('showNumber', config.showNumber);\r\n  localStorage.setItem('showName', config.showName);\r\n  localStorage.setItem('showTime', config.showTime);\r\n  localStorage.setItem('wordBreak', config.wordBreak);\r\n\r\n  console.log('[renderer.js]config saved');\r\n}\r\n\r\n/**\r\n* ローカルストレージから設定をロードする\r\n*/\r\nfunction loadConfigToLocalStrage(){\r\n  //ポート初期化\r\n  var port = localStorage.getItem('port');\r\n  if (port === null || port === 'NaN' || port.length < 1){\r\n    port = '3000';\r\n  }\r\n  //更新間隔初期化\r\n  var interval = localStorage.getItem('interval');\r\n  if (interval === null || interval.length < 1){\r\n    interval = '10';\r\n  }\r\n  // 初期メッセージ初期化\r\n  var initMessage = localStorage.getItem('initMessage');\r\n  if (initMessage === null || initMessage.length < 1){\r\n    initMessage = 'スレッド読み込みを開始しました';\r\n  }\r\n\r\n  // レス番表示初期化\r\n  var showNumber = localStorage.getItem('showNumber');\r\n  if (showNumber === null || showNumber.length < 1 || showNumber == 1){\r\n    document.getElementById(\"checkbox-showNumber\").checked = true;\r\n  }else{\r\n    document.getElementById(\"checkbox-showNumber\").checked = false;\r\n  }\r\n\r\n  // 名前表示初期化\r\n  var showName = localStorage.getItem('showName');\r\n  if (showName === null || showName.length < 1 || showName == 0){\r\n    document.getElementById(\"checkbox-showName\").checked = false;\r\n  }else{\r\n    document.getElementById(\"checkbox-showName\").checked = true;\r\n  }\r\n\r\n  // 時刻表示初期化\r\n  var showTime = localStorage.getItem('showTime');\r\n  if (showTime === null || showTime.length < 1 || showTime == 0){\r\n    document.getElementById(\"checkbox-showTime\").checked = false;\r\n  }else{\r\n    document.getElementById(\"checkbox-showTime\").checked = true;\r\n  }\r\n\r\n  // 自動改行初期化\r\n  var wordBreak = localStorage.getItem('wordBreak');\r\n  if (wordBreak === null || wordBreak.length < 1 || wordBreak == 1){\r\n    document.getElementById(\"checkbox-wordBreak\").checked = true;\r\n  }else{\r\n    document.getElementById(\"checkbox-wordBreak\").checked = false;\r\n  }\r\n\r\n  // レス表示順ラジオ初期化\r\n  var dispSort = localStorage.getItem('dispSort');\r\n  if (dispSort === null || dispSort.length < 1 || dispSort == 0){\r\n    document.getElementById(\"newResUp\").checked = true;\r\n  }else{\r\n    document.getElementById(\"newResDown\").checked = true;\r\n  }\r\n\r\n  // 改行設定初期化\r\n  var newLine = localStorage.getItem('newLine');\r\n  if (newLine === null || newLine.length < 1 || newLine == 0){\r\n    document.getElementById(\"disableNewLine\").checked = true;\r\n  }else{\r\n    document.getElementById(\"enableNewLine\").checked = true;\r\n  }\r\n\r\n  document.getElementById(\"text-port-number\").value = port;\r\n  document.getElementById(\"spanDisp\").innerHTML = interval;\r\n  document.getElementById(\"rangeSpan\").value = interval;\r\n  document.getElementById(\"text-init-message\").value = initMessage\r\n\r\n  document.getElementById(\"text-url\").value = localStorage.getItem('url');\r\n  document.getElementById(\"text-res-number\").value = localStorage.getItem('resNumber');\r\n  document.getElementById(\"text-noname\").value = localStorage.getItem('noname');\r\n  document.getElementById(\"text-disp-number\").value = localStorage.getItem('dipsNumber');\r\n  document.getElementById(\"text-youtube-url\").value = localStorage.getItem('youtubeUrl');\r\n  console.log('[renderer.js]config loaded');\r\n}\r\n\r\n//サーバー起動返信\r\nipcRenderer.on('start-server-reply', (event, arg) => {\r\n  console.log(arg);\r\n});\r\n\n\n//# sourceURL=webpack:///./src/renderer/renderer.js?");

/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron\");\n\n//# sourceURL=webpack:///external_%22electron%22?");

/***/ })

/******/ });