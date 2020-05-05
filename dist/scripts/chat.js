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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/renderer/chat.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/electron-log/src/catchErrors.js":
/*!******************************************************!*\
  !*** ./node_modules/electron-log/src/catchErrors.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Some ideas from sindresorhus/electron-unhandled
 */

var electronApi = __webpack_require__(/*! ./electronApi */ "./node_modules/electron-log/src/electronApi.js");

var isAttached = false;

module.exports = function catchErrors(options) {
  if (isAttached) return { stop: stop };
  isAttached = true;

  if (process.type === 'renderer') {
    window.addEventListener('error', onRendererError);
    window.addEventListener('unhandledrejection', onRendererRejection);
  } else {
    process.on('uncaughtException', onError);
    process.on('unhandledRejection', onRejection);
  }

  return { stop: stop };

  function onError(e) {
    try {
      if (typeof options.onError === 'function') {
        if (options.onError(e) === false) {
          return;
        }
      }

      options.log(e);

      if (options.showDialog && e.name.indexOf('UnhandledRejection') < 0) {
        var type = process.type || 'main';
        electronApi.showErrorBox(
          'A JavaScript error occurred in the ' + type + ' process',
          e.stack
        );
      }
    } catch (logError) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  function onRejection(reason) {
    if (reason instanceof Error) {
      var reasonName = 'UnhandledRejection ' + reason.name;

      var errPrototype = Object.getPrototypeOf(reason);
      var nameProperty = Object.getOwnPropertyDescriptor(errPrototype, 'name');
      if (!nameProperty || !nameProperty.writable) {
        reason = new Error(reason.message);
      }

      reason.name = reasonName;
      onError(reason);
      return;
    }

    var error = new Error(JSON.stringify(reason));
    error.name = 'UnhandledRejection';
    onError(error);
  }

  function onRendererError(event) {
    event.preventDefault();
    onError(event.error);
  }

  function onRendererRejection(event) {
    event.preventDefault();
    onRejection(event.reason);
  }

  function stop() {
    isAttached = false;

    if (process.type === 'renderer') {
      window.removeEventListener('error', onRendererError);
      window.removeEventListener('unhandledrejection', onRendererRejection);
    } else {
      process.removeListener('uncaughtException', onError);
      process.removeListener('unhandledRejection', onRejection);
    }
  }
};


/***/ }),

/***/ "./node_modules/electron-log/src/electronApi.js":
/*!******************************************************!*\
  !*** ./node_modules/electron-log/src/electronApi.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Split Electron API from the main code
 */

var electron;
try {
  // eslint-disable-next-line global-require
  electron = __webpack_require__(/*! electron */ "electron");
} catch (e) {
  electron = null;
}

module.exports = {
  getName: getName,
  getPath: getPath,
  getVersion: getVersion,
  isDev: isDev,
  isElectron: isElectron,
  isIpcChannelListened: isIpcChannelListened,
  loadRemoteModule: loadRemoteModule,
  onIpc: onIpc,
  sendIpc: sendIpc,
  showErrorBox: showErrorBox,
};

function getApp() {
  return getElectronModule('app');
}

function getName() {
  var app = getApp();
  if (!app) return null;

  return 'name' in app ? app.name : app.getName();
}

function getElectronModule(name) {
  if (!electron) {
    return null;
  }

  if (electron[name]) {
    return electron[name];
  }

  if (electron.remote) {
    return electron.remote[name];
  }

  return null;
}

function getIpc() {
  if (process.type === 'browser' && electron && electron.ipcMain) {
    return electron.ipcMain;
  }

  if (process.type === 'renderer' && electron && electron.ipcRenderer) {
    return electron.ipcRenderer;
  }

  return null;
}


function getPath(name) {
  var app = getApp();
  if (!app) return null;

  try {
    return app.getPath(name);
  } catch (e) {
    return null;
  }
}

function getRemote() {
  if (electron && electron.remote) {
    return electron.remote;
  }

  return null;
}

function getVersion() {
  var app = getApp();
  if (!app) return null;

  return 'version' in app ? app.version : app.getVersion();
}

function isDev() {
  // based on sindresorhus/electron-is-dev
  var app = getApp();
  if (!app) return false;

  return !app.isPackaged || process.env.ELECTRON_IS_DEV === '1';
}

function isElectron() {
  return process.type === 'browser' || process.type === 'renderer';
}

/**
 * Return true if the process listens for the IPC channel
 * @param {string} channel
 */
function isIpcChannelListened(channel) {
  var ipc = getIpc();
  return ipc ? ipc.listenerCount(channel) > 0 : false;
}

/**
 * Try to load the module in the opposite process
 * @param {string} moduleName
 */
function loadRemoteModule(moduleName) {
  if (process.type === 'browser') {
    getApp().on('web-contents-created', function (e, contents) {
      var promise = contents.executeJavaScript(
        'try {require("' + moduleName + '")} catch(e){}; void 0;'
      );

      // Do nothing on error, just prevent Unhandled rejection
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    });
  } else if (process.type === 'renderer') {
    try {
      getRemote().require(moduleName);
    } catch (e) {
      // Can't be required. Webpack?
    }
  }
}

/**
 * Listen to async messages sent from opposite process
 * @param {string} channel
 * @param {function} listener
 */
function onIpc(channel, listener) {
  var ipc = getIpc();
  if (ipc) {
    ipc.on(channel, listener);
  }
}

/**
 * Sent a message to opposite process
 * @param {string} channel
 * @param {any} message
 */
function sendIpc(channel, message) {
  if (process.type === 'browser') {
    sendIpcToRenderer(channel, message);
  } else if (process.type === 'renderer') {
    sendIpcToMain(channel, message);
  }
}

function sendIpcToMain(channel, message) {
  var ipc = getIpc();
  if (ipc) {
    ipc.send(channel, message);
  }
}

function sendIpcToRenderer(channel, message) {
  if (!electron || !electron.BrowserWindow) {
    return;
  }

  electron.BrowserWindow.getAllWindows().forEach(function (wnd) {
    wnd.webContents && wnd.webContents.send(channel, message);
  });
}

function showErrorBox(title, message) {
  var dialog = getElectronModule('dialog');
  if (!dialog) return;

  dialog.showErrorBox(title, message);
}


/***/ }),

/***/ "./node_modules/electron-log/src/index.js":
/*!************************************************!*\
  !*** ./node_modules/electron-log/src/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var catchErrors = __webpack_require__(/*! ./catchErrors */ "./node_modules/electron-log/src/catchErrors.js");
var electronApi = __webpack_require__(/*! ./electronApi */ "./node_modules/electron-log/src/electronApi.js");
var log = __webpack_require__(/*! ./log */ "./node_modules/electron-log/src/log.js").log;
var scopeFactory = __webpack_require__(/*! ./scope */ "./node_modules/electron-log/src/scope.js");
var transportConsole = __webpack_require__(/*! ./transports/console */ "./node_modules/electron-log/src/transports/console.js");
var transportFile = __webpack_require__(/*! ./transports/file */ "./node_modules/electron-log/src/transports/file/index.js");
var transportIpc = __webpack_require__(/*! ./transports/ipc */ "./node_modules/electron-log/src/transports/ipc.js");
var transportRemote = __webpack_require__(/*! ./transports/remote */ "./node_modules/electron-log/src/transports/remote.js");

module.exports = create('default');
module.exports.default = module.exports;

/**
 * @param {string} logId
 * @return {ElectronLog.ElectronLog}
 */
function create(logId) {
  /**
   * @type {ElectronLog.ElectronLog}
   */
  var instance = {
    catchErrors: function callCatchErrors(options) {
      var opts = Object.assign({}, {
        log: instance.error,
        showDialog: process.type === 'browser',
      }, options || {});

      catchErrors(opts);
    },
    create: create,
    functions: {},
    hooks: [],
    isDev: electronApi.isDev(),
    levels: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'],
    logId: logId,
    variables: {
      processType: process.type,
    },
  };

  instance.scope = scopeFactory(instance);

  instance.transports = {
    console: transportConsole(instance),
    file: transportFile(instance),
    remote: transportRemote(instance),
    ipc: transportIpc(instance),
  };

  instance.levels.forEach(function (level) {
    instance[level] = log.bind(null, instance, { level: level });
    instance.functions[level] = instance[level];
  });

  instance.log = log.bind(null, instance, { level: 'info' });
  instance.functions.log = instance.log;

  return instance;
}


/***/ }),

/***/ "./node_modules/electron-log/src/log.js":
/*!**********************************************!*\
  !*** ./node_modules/electron-log/src/log.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  compareLevels: compareLevels,
  log: log,
  runTransport: runTransport,
  runTransports: runTransports,
};

function log(electronLog, options) {
  var transports = electronLog.transports;

  var message = {
    data: Array.prototype.slice.call(arguments, 2),
    date: new Date(),
    level: options.level,
    scope: options.scope ? options.scope.toJSON() : null,
    variables: electronLog.variables,
  };

  runTransports(transports, message, electronLog);
}

function runTransports(transports, message, electronLog) {
  for (var i in transports) {
    if (Object.prototype.hasOwnProperty.call(transports, i)) {
      runTransport(transports[i], message, electronLog);
    }
  }
}

function runTransport(transport, message, electronLog) {
  if (typeof transport !== 'function' || transport.level === false) {
    return;
  }

  if (!compareLevels(electronLog.levels, transport.level, message.level)) {
    return;
  }

  message = runHooks(electronLog.hooks, transport, message);

  if (message) {
    transport(message);
  }
}

function compareLevels(levels, passLevel, checkLevel) {
  var pass = levels.indexOf(passLevel);
  var check = levels.indexOf(checkLevel);
  if (check === -1 || pass === -1) {
    return true;
  }

  return check <= pass;
}

function runHooks(hooks, transport, message) {
  if (!hooks || !hooks.length) {
    return message;
  }

  // eslint-disable-next-line no-plusplus
  for (var i = 0; i < hooks.length; i++) {
    message = hooks[i](message, transport);
    if (!message) break;
  }

  return message;
}


/***/ }),

/***/ "./node_modules/electron-log/src/scope.js":
/*!************************************************!*\
  !*** ./node_modules/electron-log/src/scope.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var log = __webpack_require__(/*! ./log */ "./node_modules/electron-log/src/log.js").log;

module.exports = scopeFactory;

/**
 * @param {ElectronLog.ElectronLog} electronLog
 * @return {ElectronLog.Scope}
 */
function scopeFactory(electronLog) {
  scope.labelPadding = true;
  scope.defaultLabel = '';

  /** @private */
  scope.maxLabelLength = 0;

  /**
   * @type {typeof getOptions}
   * @package
   */
  scope.getOptions = getOptions;

  return scope;

  function scope(label) {
    var instance = {
      label: label,
      toJSON: function () {
        return {
          label: this.label,
        };
      },
    };

    electronLog.levels.forEach(function (level) {
      instance[level] = log.bind(null, electronLog, {
        level: level,
        scope: instance,
      });
    });

    instance.log = instance.info;

    scope.maxLabelLength = Math.max(scope.maxLabelLength, label.length);

    return instance;
  }

  function getOptions() {
    return {
      defaultLabel: scope.defaultLabel,
      labelLength: getLabelLength(),
    };
  }

  function getLabelLength() {
    if (scope.labelPadding === true) {
      return scope.maxLabelLength;
    }

    if (scope.labelPadding === false) {
      return 0;
    }

    if (typeof scope.labelPadding === 'number') {
      return scope.labelPadding;
    }

    return 0;
  }
}


/***/ }),

/***/ "./node_modules/electron-log/src/transform/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/electron-log/src/transform/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var object = __webpack_require__(/*! ./object */ "./node_modules/electron-log/src/transform/object.js");
var style = __webpack_require__(/*! ./style */ "./node_modules/electron-log/src/transform/style.js");
var template = __webpack_require__(/*! ./template */ "./node_modules/electron-log/src/transform/template.js");

module.exports = {
  applyAnsiStyles: style.applyAnsiStyles,
  concatFirstStringElements: template.concatFirstStringElements,
  customFormatterFactory: customFormatterFactory,
  maxDepthFactory: object.maxDepthFactory,
  removeStyles: style.removeStyles,
  toJSON: object.toJSON,
  toString: object.toString,
  transform: transform,
};

function customFormatterFactory(customFormat, concatFirst, scopeOptions) {
  if (typeof customFormat === 'string') {
    return function customStringFormatter(data, message) {
      return transform(message, [
        template.templateVariables,
        template.templateScopeFactory(scopeOptions),
        template.templateDate,
        template.templateText,
        concatFirst && template.concatFirstStringElements,
      ], [customFormat].concat(data));
    };
  }

  if (typeof customFormat === 'function') {
    return function customFunctionFormatter(data, message) {
      var modifiedMessage = Object.assign({}, message, { data: data });
      var texts = customFormat(modifiedMessage, data);
      return [].concat(texts);
    };
  }

  return function (data) {
    return [].concat(data);
  };
}

function transform(message, transformers, initialData) {
  return transformers.reduce(function (data, transformer) {
    if (typeof transformer === 'function') {
      return transformer(data, message);
    }

    return data;
  }, initialData || message.data);
}


/***/ }),

/***/ "./node_modules/electron-log/src/transform/object.js":
/*!***********************************************************!*\
  !*** ./node_modules/electron-log/src/transform/object.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(/*! util */ "util");

module.exports = {
  maxDepthFactory: maxDepthFactory,
  serialize: serialize,
  toJSON: toJSON,
  toString: toString,
};

function createSerializer() {
  var seen = createWeakSet();

  return function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }

      seen.add(value);
    }

    return serialize(key, value);
  };
}

/**
 * @return {WeakSet<object>}
 */
function createWeakSet() {
  if (typeof WeakSet !== 'undefined') {
    return new WeakSet();
  }

  var cache = [];
  this.add = function (value) { cache.push(value) };
  this.has = function (value) { return cache.indexOf(value) !== -1 };

  return this;
}

function maxDepth(data, depth) {
  if (!data) {
    return data;
  }

  if (depth < 1) {
    if (data.map) return '[array]';
    if (typeof data === 'object') return '[object]';

    return data;
  }

  if (typeof data.map === 'function') {
    return data.map(function (child) {
      return maxDepth(child, depth - 1);
    });
  }

  if (typeof data !== 'object') {
    return data;
  }

  if (data && typeof data.toISOString === 'function') {
    return data;
  }

  // noinspection PointlessBooleanExpressionJS
  if (data === null) {
    return null;
  }

  if (data instanceof Error) {
    return data;
  }

  var newJson = {};
  for (var i in data) {
    if (!Object.prototype.hasOwnProperty.call(data, i)) continue;
    newJson[i] = maxDepth(data[i], depth - 1);
  }

  return newJson;
}

function maxDepthFactory(depth) {
  depth = depth || 6;

  return function maxDepthFunction(data) {
    return maxDepth(data, depth);
  };
}

function serialize(key, value) {
  if (value instanceof Error) {
    var object = Object.assign(
      {
        constructor: (value.constructor && value.constructor.name) || 'Error',
      },
      value,
      { stack: value.stack }
    );

    if (!object.stack) {
      object.message = value.message;
    }

    if (value.constructor && value.constructor.name) {
      object.constructor = value.constructor.name;
    }

    return object;
  }

  if (!value) {
    return value;
  }

  if (typeof value.toJSON === 'function') {
    return value.toJSON();
  }

  if (typeof value === 'function') {
    return '[function] ' + value.toString();
  }

  return value;
}

function toJSON(data) {
  return JSON.parse(JSON.stringify(data, createSerializer()));
}

function toString(data) {
  var simplifiedData = data.map(function (item) {
    if (item === undefined) {
      return undefined;
    }

    return JSON.parse(JSON.stringify(item, createSerializer(), '  '));
  });

  return util.format.apply(util, simplifiedData);
}


/***/ }),

/***/ "./node_modules/electron-log/src/transform/style.js":
/*!**********************************************************!*\
  !*** ./node_modules/electron-log/src/transform/style.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  applyAnsiStyles: applyAnsiStyles,
  removeStyles: removeStyles,
  transformStyles: transformStyles,
};

var ANSI_COLORS = {
  unset: '\x1b[0m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function applyAnsiStyles(data) {
  return transformStyles(data, styleToAnsi, resetAnsiStyle);
}

function styleToAnsi(style) {
  var color = style.replace(/color:\s*(\w+).*/, '$1').toLowerCase();
  return ANSI_COLORS[color] || '';
}

function resetAnsiStyle(string) {
  return string + ANSI_COLORS.unset;
}

function removeStyles(data) {
  return transformStyles(data, function () { return '' });
}

function transformStyles(data, onStyleFound, onStyleApplied) {
  var foundStyles = {};

  return data.reduce(function (result, item, index, array) {
    if (foundStyles[index]) {
      return result;
    }

    if (typeof item === 'string') {
      var valueIndex = index;
      var styleApplied = false;

      item = item.replace(/%[1cdfiOos]/g, function (match) {
        valueIndex += 1;

        if (match !== '%c') {
          return match;
        }

        var style = array[valueIndex];
        if (typeof style === 'string') {
          foundStyles[valueIndex] = true;
          styleApplied = true;
          return onStyleFound(style, item);
        }

        return match;
      });

      if (styleApplied && onStyleApplied) {
        item = onStyleApplied(item);
      }
    }

    result.push(item);
    return result;
  }, []);
}


/***/ }),

/***/ "./node_modules/electron-log/src/transform/template.js":
/*!*************************************************************!*\
  !*** ./node_modules/electron-log/src/transform/template.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  concatFirstStringElements: concatFirstStringElements,
  formatDate: formatDate,
  formatTimeZone: formatTimeZone,
  pad: pad,
  padString: padString,
  templateDate: templateDate,
  templateVariables: templateVariables,
  templateScopeFactory: templateScopeFactory,
  templateText: templateText,
};

/**
 * The first argument of console.log may contain templates. In the library
 * the first element is a string related to transports.console.format. So
 * this function concatenates first two elements to make templates like %d
 * work
 * @param {*[]} data
 * @return {*[]}
 */
function concatFirstStringElements(data) {
  if (typeof data[0] !== 'string' || typeof data[1] !== 'string') {
    return data;
  }

  if (data[0].match(/%[1cdfiOos]/)) {
    return data;
  }

  data[1] = data[0] + ' ' + data[1];
  data.shift();

  return data;
}

function formatDate(template, date) {
  return template
    .replace('{y}', String(date.getFullYear()))
    .replace('{m}', pad(date.getMonth() + 1))
    .replace('{d}', pad(date.getDate()))
    .replace('{h}', pad(date.getHours()))
    .replace('{i}', pad(date.getMinutes()))
    .replace('{s}', pad(date.getSeconds()))
    .replace('{ms}', pad(date.getMilliseconds(), 3))
    .replace('{z}', formatTimeZone(date.getTimezoneOffset()))
    .replace('{iso}', date.toISOString());
}

function formatTimeZone(minutesOffset) {
  var m = Math.abs(minutesOffset);
  return (minutesOffset >= 0 ? '-' : '+')
    + pad(Math.floor(m / 60)) + ':'
    + pad(m % 60);
}

function pad(number, zeros) {
  zeros = zeros || 2;
  return (new Array(zeros + 1).join('0') + number).substr(-zeros, zeros);
}

function padString(value, length) {
  length = Math.max(length, value.length);
  var padValue = Array(length + 1).join(' ');
  return (value + padValue).substring(0, length);
}

function templateDate(data, message) {
  var template = data[0];
  if (typeof template !== 'string') {
    return data;
  }

  data[0] = formatDate(template, message.date);
  return data;
}

/**
 * @param {{ labelLength: number, defaultLabel: string }} options
 */
function templateScopeFactory(options) {
  options = options || {};
  var labelLength = options.labelLength || 0;

  return function templateScope(data, message) {
    var template = data[0];
    var label = message.scope && message.scope.label;

    if (!label) {
      label = options.defaultLabel;
    }

    var scopeText;
    if (label === '') {
      scopeText = labelLength > 0 ? padString('', labelLength + 3) : '';
    } else if (typeof label === 'string') {
      scopeText = padString(' (' + label + ')', labelLength + 3);
    } else {
      scopeText = '';
    }

    data[0] = template.replace('{scope}', scopeText);
    return data;
  };
}

function templateVariables(data, message) {
  var template = data[0];
  var variables = message.variables;

  if (typeof template !== 'string' || !message.variables) {
    return data;
  }

  for (var i in variables) {
    if (!Object.prototype.hasOwnProperty.call(variables, i)) continue;
    template = template.replace('{' + i + '}', variables[i]);
  }

  template = template.replace('{level}', message.level);

  data[0] = template;
  return data;
}

function templateText(data) {
  var template = data[0];
  if (typeof template !== 'string') {
    return data;
  }

  var textTplPosition = template.lastIndexOf('{text}');
  if (textTplPosition === template.length - 6) {
    data[0] = template.replace(/\s?{text}/, '');
    if (data[0] === '') {
      data.shift();
    }

    return data;
  }

  var templatePieces = template.split('{text}');
  var result = [];

  if (templatePieces[0] !== '') {
    result.push(templatePieces[0]);
  }

  result = result.concat(data.slice(1));

  if (templatePieces[1] !== '') {
    result.push(templatePieces[1]);
  }

  return result;
}


/***/ }),

/***/ "./node_modules/electron-log/src/transports/console.js":
/*!*************************************************************!*\
  !*** ./node_modules/electron-log/src/transports/console.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable no-multi-spaces, no-console */

var transform = __webpack_require__(/*! ../transform */ "./node_modules/electron-log/src/transform/index.js");

var original = {
  context: console,
  error:   console.error,
  warn:    console.warn,
  info:    console.info,
  verbose: console.verbose,
  debug:   console.debug,
  silly:   console.silly,
  log:     console.log,
};

module.exports = consoleTransportFactory;
module.exports.transformRenderer = transformRenderer;
module.exports.transformMain = transformMain;

var separator = process.platform === 'win32' ? '>' : '›';
var DEFAULT_FORMAT = {
  browser: '%c{h}:{i}:{s}.{ms}{scope}%c ' + separator + ' {text}',
  renderer: '{h}:{i}:{s}.{ms}{scope} › {text}',
  worker: '{h}:{i}:{s}.{ms}{scope} › {text}',
};

function consoleTransportFactory(electronLog) {
  transport.level  = 'silly';
  transport.useStyles = process.env.FORCE_STYLES;
  transport.format = DEFAULT_FORMAT[process.type] || DEFAULT_FORMAT.browser;

  return transport;

  function transport(message) {
    var scopeOptions = electronLog.scope.getOptions();

    var data;
    if (process.type === 'renderer' || process.type === 'worker') {
      data = transformRenderer(message, transport, scopeOptions);
    } else {
      data = transformMain(message, transport, scopeOptions);
    }

    consoleLog(message.level, data);
  }
}

function transformRenderer(message, transport, scopeOptions) {
  return transform.transform(message, [
    transform.customFormatterFactory(transport.format, true, scopeOptions),
  ]);
}

function transformMain(message, transport, scopeOptions) {
  var useStyles = canUseStyles(transport.useStyles, message.level);

  return transform.transform(message, [
    addTemplateColorFactory(transport.format),
    transform.customFormatterFactory(transport.format, false, scopeOptions),
    useStyles ? transform.applyAnsiStyles : transform.removeStyles,
    transform.concatFirstStringElements,
    transform.maxDepthFactory(4),
    transform.toJSON,
  ]);
}

function addTemplateColorFactory(format) {
  return function addTemplateColors(data, message) {
    if (format !== DEFAULT_FORMAT.browser) {
      return data;
    }

    return ['color:' + levelToStyle(message.level), 'color:unset'].concat(data);
  };
}

function canUseStyles(useStyleValue, level) {
  if (useStyleValue === true || useStyleValue === false) {
    return useStyleValue;
  }

  var useStderr = level === 'error' || level === 'warn';
  var stream = useStderr ? process.stderr : process.stdout;
  return stream && stream.isTTY;
}

function consoleLog(level, args) {
  if (original[level]) {
    original[level].apply(original.context, args);
  } else {
    original.log.apply(original.context, args);
  }
}

function levelToStyle(level) {
  switch (level) {
    case 'error': return 'red';
    case 'warn':  return 'yellow';
    case 'info':  return 'cyan';
    default:      return 'unset';
  }
}


/***/ }),

/***/ "./node_modules/electron-log/src/transports/file/file.js":
/*!***************************************************************!*\
  !*** ./node_modules/electron-log/src/transports/file/file.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EventEmitter = __webpack_require__(/*! events */ "events");
var fs = __webpack_require__(/*! fs */ "fs");
var os = __webpack_require__(/*! os */ "os");
var path = __webpack_require__(/*! path */ "path");
var util = __webpack_require__(/*! util */ "util");

module.exports = {
  File: File,
  FileRegistry: FileRegistry,
  NullFile: NullFile,
};

/**
 * File manipulations on filesystem
 * @class
 * @extends EventEmitter
 * @property {number} size
 *
 * @constructor
 * @param {string} filePath
 * @param {WriteOptions} [writeOptions]
 * @param {boolean} [writeAsync]
 */
function File(filePath, writeOptions, writeAsync) {
  EventEmitter.call(this);

  /**
   * @type {string}
   * @readonly
   */
  this.path = filePath;

  /**
   * @type {number}
   * @private
   */
  this.initialSize = undefined;

  /**
   * @type {number}
   * @readonly
   */
  this.bytesWritten = 0;

  /**
   * @type {boolean}
   * @private
   */
  this.writeAsync = Boolean(writeAsync);

  /**
   * @type {string[]}
   * @private
   */
  this.asyncWriteQueue = [];

  /**
   * @type {WriteOptions}
   * @private
   */
  this.writeOptions = writeOptions || {
    flag: 'a',
    mode: 438, // 0666
    encoding: 'utf8',
  };

  Object.defineProperty(this, 'size', {
    get: this.getSize.bind(this),
  });
}

util.inherits(File, EventEmitter);

File.prototype.clear = function () {
  try {
    fs.writeFileSync(this.path, '', {
      mode: this.writeOptions.mode,
      flag: 'w',
    });
    this.reset();
    return true;
  } catch (e) {
    if (e.code === 'ENOENT') {
      return true;
    }

    this.emit('error', e, this);
    return false;
  }
};

File.prototype.crop = function (bytesAfter) {
  try {
    var content = readFileSyncFromEnd(this.path, bytesAfter || 4096);
    this.clear();
    this.writeLine('[log cropped]' + os.EOL + content);
  } catch (e) {
    this.emit(
      'error',
      new Error('Couldn\'t crop file ' + this.path + '. ' + e.message),
      this
    );
  }
};

File.prototype.toString = function () {
  return this.path;
};

/**
 * @package
 */
File.prototype.reset = function () {
  this.initialSize = undefined;
  this.bytesWritten = 0;
};

/**
 * @package
 */
File.prototype.writeLine = function (text) {
  text += os.EOL;

  if (this.writeAsync) {
    this.asyncWriteQueue.push(text);
    this.nextAsyncWrite();
    return;
  }

  try {
    fs.writeFileSync(this.path, text, this.writeOptions);
    this.increaseBytesWrittenCounter(text);
  } catch (e) {
    this.emit(
      'error',
      new Error('Couldn\'t write to ' + this.path + '. ' + e.message),
      this
    );
  }
};

/**
 * @return {number}
 * @protected
 */
File.prototype.getSize = function () {
  if (this.initialSize === undefined) {
    try {
      var stats = fs.statSync(this.path);
      this.initialSize = stats.size;
    } catch (e) {
      this.initialSize = 0;
    }
  }

  return this.initialSize + this.bytesWritten;
};

/**
 * @return {boolean}
 * @package
 */
File.prototype.isNull = function () {
  return false;
};

/**
 * @private
 */
File.prototype.increaseBytesWrittenCounter = function (text) {
  this.bytesWritten += Buffer.byteLength(text, this.writeOptions.encoding);
};

/**
 * @private
 */
File.prototype.nextAsyncWrite = function () {
  var file = this;

  if (this.asyncWriteQueue.length < 1) {
    return;
  }

  var text = this.asyncWriteQueue.shift();

  fs.writeFile(this.path, text, this.writeOptions, function (e) {
    if (e) {
      file.emit(
        'error',
        new Error('Couldn\'t write to ' + file.path + '. ' + e.message),
        this
      );
    } else {
      file.increaseBytesWrittenCounter(text);
    }

    file.nextAsyncWrite();
  });
};

/**
 * File manipulations on filesystem
 * @class
 * @property {number} size
 *
 * @constructor
 * @param {string} filePath
 */
function NullFile(filePath) {
  File.call(this, filePath);
}

util.inherits(NullFile, File);

NullFile.prototype.clear = function () {};
NullFile.prototype.crop = function () {};
NullFile.prototype.writeLine = function () {};
NullFile.prototype.getSize = function () { return 0 };
NullFile.prototype.isNull = function () { return true };

/**
 * Collection, key is a file path, value is a File instance
 * @class
 *
 * @constructor
 */
function FileRegistry() {
  EventEmitter.call(this);
  this.store = {};

  this.emitError = this.emitError.bind(this);
}

util.inherits(FileRegistry, EventEmitter);

/**
 * Provide a File object corresponding to the filePath
 * @param {string} filePath
 * @param {WriteOptions} [writeOptions]
 * @param {boolean} [async]
 * @return {File}
 */
FileRegistry.prototype.provide = function (filePath, writeOptions, async) {
  var file;
  try {
    filePath = path.resolve(filePath);

    if (this.store[filePath]) {
      return this.store[filePath];
    }

    file = this.createFile(filePath, writeOptions, Boolean(async));
  } catch (e) {
    file = new NullFile(filePath);
    this.emitError(e, file);
  }

  file.on('error', this.emitError);
  this.store[filePath] = file;
  return file;
};

/**
 * @param {string} filePath
 * @param {WriteOptions} writeOptions
 * @param {boolean} async
 * @return {File}
 * @private
 */
FileRegistry.prototype.createFile = function (filePath, writeOptions, async) {
  this.testFileWriting(filePath);
  return new File(filePath, writeOptions, async);
};

/**
 * @param {Error} error
 * @param {File} file
 * @private
 */
FileRegistry.prototype.emitError = function (error, file) {
  this.emit('error', error, file);
};

/**
 * @param {string} filePath
 * @private
 */
FileRegistry.prototype.testFileWriting = function (filePath) {
  mkDir(path.dirname(filePath));
  fs.writeFileSync(filePath, '', { flag: 'a' });
};

function mkDir(dirPath) {
  if (checkNodeJsVersion(10.12)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  }

  try {
    fs.mkdirSync(dirPath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return mkDir(path.dirname(dirPath)) && mkDir(dirPath);
    }

    try {
      if (fs.statSync(dirPath).isDirectory()) {
        return true;
      }

      // noinspection ExceptionCaughtLocallyJS
      throw error;
    } catch (e) {
      throw e;
    }
  }
}

function checkNodeJsVersion(version) {
  if (!process.versions) {
    return false;
  }

  var nodeVersion = Number(
    process.version.match(/^v(\d+\.\d+)/)[1].replace(/\.(\d)$/, '.0$1')
  );

  return nodeVersion >= version;
}

function readFileSyncFromEnd(filePath, bytesCount) {
  var buffer = Buffer.alloc(bytesCount);
  var stats = fs.statSync(filePath);

  var readLength = Math.min(stats.size, bytesCount);
  var offset = Math.max(0, stats.size - bytesCount);

  var fd = fs.openSync(filePath, 'r');
  var totalBytes = fs.readSync(fd, buffer, 0, readLength, offset);
  fs.closeSync(fd);

  return buffer.toString('utf8', 0, totalBytes);
}


/***/ }),

/***/ "./node_modules/electron-log/src/transports/file/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/electron-log/src/transports/file/index.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fs = __webpack_require__(/*! fs */ "fs");
var path = __webpack_require__(/*! path */ "path");
var util = __webpack_require__(/*! util */ "util");
var transform = __webpack_require__(/*! ../../transform */ "./node_modules/electron-log/src/transform/index.js");
var FileRegistry = __webpack_require__(/*! ./file */ "./node_modules/electron-log/src/transports/file/file.js").FileRegistry;
var variables = __webpack_require__(/*! ./variables */ "./node_modules/electron-log/src/transports/file/variables.js");

module.exports = fileTransportFactory;

// Shared between multiple file transport instances
var globalRegistry = new FileRegistry();

function fileTransportFactory(electronLog, customRegistry) {
  var pathVariables = variables.getPathVariables(process.platform);

  var registry = customRegistry || globalRegistry;
  registry.on('error', function (e, file) {
    logConsole('Can\'t write to ' + file, e);
  });

  /* eslint-disable no-multi-spaces */
  transport.archiveLog   = archiveLog;
  transport.fileName     = getDefaultFileName();
  transport
    .format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}';
  transport.getFile      = getFile;
  transport.level        = 'silly';
  transport.maxSize      = 1024 * 1024;
  transport.resolvePath  = resolvePath;
  transport.sync         = true;
  transport.writeOptions = {
    flag: 'a',
    mode: 438, // 0666
    encoding: 'utf8',
  };

  initDeprecated();

  return transport;

  function transport(message) {
    var file = getFile(message);

    var needLogRotation = transport.maxSize > 0
      && file.size > transport.maxSize;

    if (needLogRotation) {
      transport.archiveLog(file);
      file.reset();
    }

    var scopeOptions = electronLog.scope.getOptions();
    var content = transform.transform(message, [
      transform.removeStyles,
      transform.customFormatterFactory(transport.format, false, scopeOptions),
      transform.concatFirstStringElements,
      transform.maxDepthFactory(),
      transform.toString,
    ]);

    file.writeLine(content);
  }

  function archiveLog(file) {
    var oldPath = file.toString();
    var inf = path.parse(oldPath);
    try {
      fs.renameSync(oldPath, path.join(inf.dir, inf.name + '.old' + inf.ext));
    } catch (e) {
      logConsole('Could not rotate log', e);
      var quarterOfMaxSize = Math.round(transport.maxSize / 4);
      file.crop(Math.min(quarterOfMaxSize, 256 * 1024));
    }
  }

  function logConsole(message, error) {
    var data = ['electron-log.transports.file: ' + message];

    if (error) {
      data.push(error);
    }

    electronLog.transports.console({
      data: data,
      date: new Date(),
      level: 'warn',
    });
  }

  function getFile(msg) {
    var vars = Object.assign({}, pathVariables, {
      fileName: transport.fileName,
    });

    var filePath = transport.resolvePath(vars, msg);
    return registry.provide(filePath, transport.writeOptions, !transport.sync);
  }

  /**
   * @param {PathVariables} vars
   */
  function resolvePath(vars) {
    return path.join(vars.libraryDefaultDir, vars.fileName);
  }

  function initDeprecated() {
    var isDeprecatedText = ' is deprecated and will be removed in v5.';
    var isDeprecatedProp = ' property' + isDeprecatedText;

    Object.defineProperties(transport, {
      bytesWritten: {
        get: util.deprecate(getBytesWritten, 'bytesWritten' + isDeprecatedProp),
      },

      file: {
        get: util.deprecate(getLogFile, 'file' + isDeprecatedProp),
        set: util.deprecate(setLogFile, 'file' + isDeprecatedProp),
      },

      fileSize: {
        get: util.deprecate(getFileSize, 'file' + isDeprecatedProp),
      },
    });

    transport.clear = util.deprecate(clear, 'clear()' + isDeprecatedText);
    transport.findLogPath = util.deprecate(
      getLogFile,
      'findLogPath()' + isDeprecatedText
    );
    transport.init = util.deprecate(init, 'init()' + isDeprecatedText);

    function getBytesWritten() {
      return getFile().bytesWritten;
    }

    function getLogFile() {
      return getFile().path;
    }

    function setLogFile(filePath) {
      transport.resolvePath = function () {
        return filePath;
      };
    }

    function getFileSize() {
      return getFile().size;
    }

    function clear() {
      getFile().clear();
    }

    function init() {}
  }
}

function getDefaultFileName() {
  switch (process.type) {
    case 'renderer': return 'renderer.log';
    case 'worker': return 'worker.log';
    default: return 'main.log';
  }
}


/***/ }),

/***/ "./node_modules/electron-log/src/transports/file/packageJson.js":
/*!**********************************************************************!*\
  !*** ./node_modules/electron-log/src/transports/file/packageJson.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable consistent-return */

var fs = __webpack_require__(/*! fs */ "fs");
var path = __webpack_require__(/*! path */ "path");

module.exports = {
  readPackageJson: readPackageJson,
  tryReadJsonAt: tryReadJsonAt,
};

/**
 * @return {{ name?: string, version?: string}}
 */
function readPackageJson() {
  return tryReadJsonAt(__webpack_require__.c[__webpack_require__.s] && __webpack_require__.c[__webpack_require__.s].filename)
    || tryReadJsonAt(process.resourcesPath, 'app.asar')
    || tryReadJsonAt(process.cwd())
    || { name: null, version: null };
}

/**
 * @param {...string} searchPath
 * @return {{ name?: string, version?: string } | null}
 */
function tryReadJsonAt(searchPath) {
  try {
    searchPath = path.join.apply(path, arguments);
    var fileName = findUp('package.json', searchPath);
    if (!fileName) {
      return null;
    }

    var json = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    var name = json.productName || json.name;
    if (!name || name.toLowerCase() === 'electron') {
      return null;
    }

    if (json.productName || json.name) {
      return {
        name: name,
        version: json.version,
      };
    }
  } catch (e) {
    return null;
  }
}

/**
 * @param {string} fileName
 * @param {string} [cwd]
 * @return {string | null}
 */
function findUp(fileName, cwd) {
  var currentPath = cwd;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    var parsedPath = path.parse(currentPath);
    var root = parsedPath.root;
    var dir = parsedPath.dir;

    if (fs.existsSync(path.join(currentPath, fileName))) {
      return path.resolve(path.join(currentPath, fileName));
    }

    if (currentPath === root) {
      return null;
    }

    currentPath = dir;
  }
}


/***/ }),

/***/ "./node_modules/electron-log/src/transports/file/variables.js":
/*!********************************************************************!*\
  !*** ./node_modules/electron-log/src/transports/file/variables.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var os = __webpack_require__(/*! os */ "os");
var path = __webpack_require__(/*! path */ "path");
var electronApi = __webpack_require__(/*! ../../electronApi */ "./node_modules/electron-log/src/electronApi.js");
var packageJson = __webpack_require__(/*! ./packageJson */ "./node_modules/electron-log/src/transports/file/packageJson.js");

module.exports = {
  getAppData: getAppData,
  getLibraryDefaultDir: getLibraryDefaultDir,
  getLibraryTemplate: getLibraryTemplate,
  getNameAndVersion: getNameAndVersion,
  getPathVariables: getPathVariables,
  getUserData: getUserData,
};

function getAppData(platform) {
  var appData = electronApi.getPath('appData');
  if (appData) {
    return appData;
  }

  var home = getHome();

  switch (platform) {
    case 'darwin': {
      return path.join(home, 'Library/Application Support');
    }

    case 'win32': {
      return process.env.APPDATA || path.join(home, 'AppData/Roaming');
    }

    default: {
      return process.env.XDG_CONFIG_HOME || path.join(home, '.config');
    }
  }
}

function getHome() {
  return os.homedir ? os.homedir() : process.env.HOME;
}

function getLibraryDefaultDir(platform, appName) {
  if (platform === 'darwin') {
    return path.join(getHome(), 'Library/Logs', appName);
  }

  return path.join(getUserData(platform, appName), 'logs');
}

function getLibraryTemplate(platform) {
  if (platform === 'darwin') {
    return path.join(getHome(), 'Library/Logs', '{appName}');
  }

  return path.join(getAppData(platform), '{appName}', 'logs');
}

function getNameAndVersion() {
  var name = electronApi.getName();
  var version = electronApi.getVersion();

  if (name && version) {
    return { name: name, version: version };
  }

  var packageValues = packageJson.readPackageJson();
  if (!name) {
    name = packageValues.name;
  }

  if (!version) {
    version = packageValues.version;
  }

  return { name: name, version: version };
}

/**
 * @param {string} platform
 * @return {PathVariables}
 */
function getPathVariables(platform) {
  var nameAndVersion = getNameAndVersion();
  var appName = nameAndVersion.name;
  var appVersion = nameAndVersion.version;

  return {
    appData: getAppData(platform),
    appName: appName,
    appVersion: appVersion,
    electronDefaultDir: electronApi.getPath('logs'),
    home: getHome(),
    libraryDefaultDir: getLibraryDefaultDir(platform, appName),
    libraryTemplate: getLibraryTemplate(platform),
    temp: electronApi.getPath('temp') || os.tmpdir(),
    userData: getUserData(platform, appName),
  };
}

function getUserData(platform, appName) {
  return electronApi.getPath('userData')
    || path.join(getAppData(platform), appName);
}


/***/ }),

/***/ "./node_modules/electron-log/src/transports/ipc.js":
/*!*********************************************************!*\
  !*** ./node_modules/electron-log/src/transports/ipc.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var transform = __webpack_require__(/*! ../transform */ "./node_modules/electron-log/src/transform/index.js");
var electronApi = __webpack_require__(/*! ../electronApi */ "./node_modules/electron-log/src/electronApi.js");
var log = __webpack_require__(/*! ../log.js */ "./node_modules/electron-log/src/log.js");

module.exports = ipcTransportFactory;

function ipcTransportFactory(electronLog) {
  transport.eventId = '__ELECTRON_LOG_IPC_' + electronLog.logId + '__';
  transport.level = electronLog.isDev ? 'silly' : false;

  // Prevent problems when there are multiple instances after webpack
  if (electronApi.isIpcChannelListened(transport.eventId)) {
    return function () {};
  }

  electronApi.onIpc(transport.eventId, function (_, message) {
    message.date = new Date(message.date);

    log.runTransport(
      electronLog.transports.console,
      message,
      electronLog
    );
  });

  electronApi.loadRemoteModule('electron-log');

  return electronApi.isElectron() ? transport : null;

  function transport(message) {
    var ipcMessage = Object.assign({}, message, {
      data: transform.transform(message, [
        transform.removeStyles,
        transform.toJSON,
        transform.maxDepthFactory(3),
      ]),
    });

    electronApi.sendIpc(transport.eventId, ipcMessage);
  }
}


/***/ }),

/***/ "./node_modules/electron-log/src/transports/remote.js":
/*!************************************************************!*\
  !*** ./node_modules/electron-log/src/transports/remote.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var http = __webpack_require__(/*! http */ "http");
var https = __webpack_require__(/*! https */ "https");
var url = __webpack_require__(/*! url */ "url");
var log = __webpack_require__(/*! ../log */ "./node_modules/electron-log/src/log.js");
var transform = __webpack_require__(/*! ../transform */ "./node_modules/electron-log/src/transform/index.js");

module.exports = remoteTransportFactory;

function remoteTransportFactory(electronLog) {
  transport.client = { name: 'electron-application' };
  transport.depth = 6;
  transport.level = false;
  transport.requestOptions = {};
  transport.url = null;

  return transport;

  function transport(message) {
    if (!transport.url) return;

    var request = post(transport.url, transport.requestOptions, {
      client: transport.client,
      data: transform.transform(message, [
        transform.removeStyles,
        transform.toJSON,
        transform.maxDepthFactory(transport.depth + 1),
      ]),
      date: message.date.getTime(),
      level: message.level,
      variables: message.variables,
    });

    request.on('error', function (error) {
      var errorMessage = {
        data: [
          'electron-log.transports.remote:'
          + ' cannot send HTTP request to ' + transport.url,
          error,
        ],
        date: new Date(),
        level: 'warn',
      };

      var transports = [
        electronLog.transports.console,
        electronLog.transports.ipc,
        electronLog.transports.file,
      ];

      log.runTransports(transports, errorMessage, electronLog);
    });
  }
}

function post(serverUrl, requestOptions, data) {
  var urlObject = url.parse(serverUrl);
  var httpTransport = urlObject.protocol === 'https:' ? https : http;

  var body = JSON.stringify(data);

  var options = {
    hostname: urlObject.hostname,
    port:     urlObject.port,
    path:     urlObject.path,
    method:   'POST',
    headers:  {
      'Content-Length': body.length,
      'Content-Type':   'application/json',
    },
  };

  Object.assign(options, requestOptions);

  var request = httpTransport.request(options);
  request.write(body);
  request.end();

  return request;
}


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

/***/ "./src/renderer/chat.ts":
/*!******************************!*\
  !*** ./src/renderer/chat.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = __importDefault(__webpack_require__(/*! electron */ "electron"));
var electron_log_1 = __importDefault(__webpack_require__(/*! electron-log */ "./node_modules/electron-log/src/index.js"));
var const_1 = __webpack_require__(/*! ../main/const */ "./src/main/const.ts");
var ipcRenderer = electron_1.default.ipcRenderer;
document.addEventListener('DOMContentLoaded', function () {
    console.debug('[renderer.js] DOM Content Loaded');
});
// コメント表示
ipcRenderer.on(const_1.electronEvent['show-comment'], function (event, args) {
    electron_log_1.default.info('[show-comment] received');
    var dom = document.getElementById('res-list');
    // スクロール位置が端であるなら、スクロール位置も追従する
    var isTop = document.documentElement.scrollTop === 0;
    var isBottom = document.documentElement.scrollTop + document.documentElement.clientHeight === document.documentElement.scrollHeight;
    // 表示順オプションで上に追加するか下に追加するか選ぶ
    if (args.config.dispSort) {
        // 下に追加
        dom.insertAdjacentHTML('beforeend', args.dom);
    }
    else {
        // 上に追加
        dom.insertAdjacentHTML('afterbegin', args.dom);
    }
    if (isTop) {
        document.documentElement.scrollTo(0, 0);
    }
    if (isBottom) {
        document.documentElement.scrollTo(0, document.documentElement.scrollHeight);
    }
});
// リセット
ipcRenderer.on(const_1.electronEvent['clear-comment'], function (event) {
    electron_log_1.default.info('[clear-comment] received');
    var dom = document.getElementById('res-list');
    dom.innerHTML = '';
});


/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("electron");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvZy9zcmMvY2F0Y2hFcnJvcnMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvZy9zcmMvZWxlY3Ryb25BcGkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvZy9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvZy9zcmMvbG9nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2cvc3JjL3Njb3BlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2cvc3JjL3RyYW5zZm9ybS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tbG9nL3NyYy90cmFuc2Zvcm0vb2JqZWN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2cvc3JjL3RyYW5zZm9ybS9zdHlsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tbG9nL3NyYy90cmFuc2Zvcm0vdGVtcGxhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvZy9zcmMvdHJhbnNwb3J0cy9jb25zb2xlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2cvc3JjL3RyYW5zcG9ydHMvZmlsZS9maWxlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2cvc3JjL3RyYW5zcG9ydHMvZmlsZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tbG9nL3NyYy90cmFuc3BvcnRzL2ZpbGUvcGFja2FnZUpzb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvZy9zcmMvdHJhbnNwb3J0cy9maWxlL3ZhcmlhYmxlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tbG9nL3NyYy90cmFuc3BvcnRzL2lwYy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tbG9nL3NyYy90cmFuc3BvcnRzL3JlbW90ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9jb25zdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVuZGVyZXIvY2hhdC50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvblwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImV2ZW50c1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiaHR0cFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwib3NcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXJsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwidXRpbFwiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FB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bUJBQU8sQ0FBQywwQkFBVTtBQUNuRCxxQ0FBcUMsbUJBQU8sQ0FBQyw4REFBYztBQUMzRCxjQUFjLG1CQUFPLENBQUMsMENBQWU7QUFDckM7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7QUN4Q0QscUM7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsa0M7Ozs7Ozs7Ozs7O0FDQUEsK0I7Ozs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7O0FDQUEsZ0M7Ozs7Ozs7Ozs7O0FDQUEsaUMiLCJmaWxlIjoiY2hhdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3JlbmRlcmVyL2NoYXQudHNcIik7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogU29tZSBpZGVhcyBmcm9tIHNpbmRyZXNvcmh1cy9lbGVjdHJvbi11bmhhbmRsZWRcbiAqL1xuXG52YXIgZWxlY3Ryb25BcGkgPSByZXF1aXJlKCcuL2VsZWN0cm9uQXBpJyk7XG5cbnZhciBpc0F0dGFjaGVkID0gZmFsc2U7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY2F0Y2hFcnJvcnMob3B0aW9ucykge1xuICBpZiAoaXNBdHRhY2hlZCkgcmV0dXJuIHsgc3RvcDogc3RvcCB9O1xuICBpc0F0dGFjaGVkID0gdHJ1ZTtcblxuICBpZiAocHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgb25SZW5kZXJlckVycm9yKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndW5oYW5kbGVkcmVqZWN0aW9uJywgb25SZW5kZXJlclJlamVjdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgcHJvY2Vzcy5vbigndW5jYXVnaHRFeGNlcHRpb24nLCBvbkVycm9yKTtcbiAgICBwcm9jZXNzLm9uKCd1bmhhbmRsZWRSZWplY3Rpb24nLCBvblJlamVjdGlvbik7XG4gIH1cblxuICByZXR1cm4geyBzdG9wOiBzdG9wIH07XG5cbiAgZnVuY3Rpb24gb25FcnJvcihlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5vbkVycm9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGlmIChvcHRpb25zLm9uRXJyb3IoZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG9wdGlvbnMubG9nKGUpO1xuXG4gICAgICBpZiAob3B0aW9ucy5zaG93RGlhbG9nICYmIGUubmFtZS5pbmRleE9mKCdVbmhhbmRsZWRSZWplY3Rpb24nKSA8IDApIHtcbiAgICAgICAgdmFyIHR5cGUgPSBwcm9jZXNzLnR5cGUgfHwgJ21haW4nO1xuICAgICAgICBlbGVjdHJvbkFwaS5zaG93RXJyb3JCb3goXG4gICAgICAgICAgJ0EgSmF2YVNjcmlwdCBlcnJvciBvY2N1cnJlZCBpbiB0aGUgJyArIHR5cGUgKyAnIHByb2Nlc3MnLFxuICAgICAgICAgIGUuc3RhY2tcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChsb2dFcnJvcikge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25SZWplY3Rpb24ocmVhc29uKSB7XG4gICAgaWYgKHJlYXNvbiBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICB2YXIgcmVhc29uTmFtZSA9ICdVbmhhbmRsZWRSZWplY3Rpb24gJyArIHJlYXNvbi5uYW1lO1xuXG4gICAgICB2YXIgZXJyUHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHJlYXNvbik7XG4gICAgICB2YXIgbmFtZVByb3BlcnR5ID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihlcnJQcm90b3R5cGUsICduYW1lJyk7XG4gICAgICBpZiAoIW5hbWVQcm9wZXJ0eSB8fCAhbmFtZVByb3BlcnR5LndyaXRhYmxlKSB7XG4gICAgICAgIHJlYXNvbiA9IG5ldyBFcnJvcihyZWFzb24ubWVzc2FnZSk7XG4gICAgICB9XG5cbiAgICAgIHJlYXNvbi5uYW1lID0gcmVhc29uTmFtZTtcbiAgICAgIG9uRXJyb3IocmVhc29uKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoSlNPTi5zdHJpbmdpZnkocmVhc29uKSk7XG4gICAgZXJyb3IubmFtZSA9ICdVbmhhbmRsZWRSZWplY3Rpb24nO1xuICAgIG9uRXJyb3IoZXJyb3IpO1xuICB9XG5cbiAgZnVuY3Rpb24gb25SZW5kZXJlckVycm9yKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBvbkVycm9yKGV2ZW50LmVycm9yKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uUmVuZGVyZXJSZWplY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIG9uUmVqZWN0aW9uKGV2ZW50LnJlYXNvbik7XG4gIH1cblxuICBmdW5jdGlvbiBzdG9wKCkge1xuICAgIGlzQXR0YWNoZWQgPSBmYWxzZTtcblxuICAgIGlmIChwcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uUmVuZGVyZXJFcnJvcik7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndW5oYW5kbGVkcmVqZWN0aW9uJywgb25SZW5kZXJlclJlamVjdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb2Nlc3MucmVtb3ZlTGlzdGVuZXIoJ3VuY2F1Z2h0RXhjZXB0aW9uJywgb25FcnJvcik7XG4gICAgICBwcm9jZXNzLnJlbW92ZUxpc3RlbmVyKCd1bmhhbmRsZWRSZWplY3Rpb24nLCBvblJlamVjdGlvbik7XG4gICAgfVxuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFNwbGl0IEVsZWN0cm9uIEFQSSBmcm9tIHRoZSBtYWluIGNvZGVcbiAqL1xuXG52YXIgZWxlY3Ryb247XG50cnkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ2xvYmFsLXJlcXVpcmVcbiAgZWxlY3Ryb24gPSByZXF1aXJlKCdlbGVjdHJvbicpO1xufSBjYXRjaCAoZSkge1xuICBlbGVjdHJvbiA9IG51bGw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXROYW1lOiBnZXROYW1lLFxuICBnZXRQYXRoOiBnZXRQYXRoLFxuICBnZXRWZXJzaW9uOiBnZXRWZXJzaW9uLFxuICBpc0RldjogaXNEZXYsXG4gIGlzRWxlY3Ryb246IGlzRWxlY3Ryb24sXG4gIGlzSXBjQ2hhbm5lbExpc3RlbmVkOiBpc0lwY0NoYW5uZWxMaXN0ZW5lZCxcbiAgbG9hZFJlbW90ZU1vZHVsZTogbG9hZFJlbW90ZU1vZHVsZSxcbiAgb25JcGM6IG9uSXBjLFxuICBzZW5kSXBjOiBzZW5kSXBjLFxuICBzaG93RXJyb3JCb3g6IHNob3dFcnJvckJveCxcbn07XG5cbmZ1bmN0aW9uIGdldEFwcCgpIHtcbiAgcmV0dXJuIGdldEVsZWN0cm9uTW9kdWxlKCdhcHAnKTtcbn1cblxuZnVuY3Rpb24gZ2V0TmFtZSgpIHtcbiAgdmFyIGFwcCA9IGdldEFwcCgpO1xuICBpZiAoIWFwcCkgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuICduYW1lJyBpbiBhcHAgPyBhcHAubmFtZSA6IGFwcC5nZXROYW1lKCk7XG59XG5cbmZ1bmN0aW9uIGdldEVsZWN0cm9uTW9kdWxlKG5hbWUpIHtcbiAgaWYgKCFlbGVjdHJvbikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKGVsZWN0cm9uW25hbWVdKSB7XG4gICAgcmV0dXJuIGVsZWN0cm9uW25hbWVdO1xuICB9XG5cbiAgaWYgKGVsZWN0cm9uLnJlbW90ZSkge1xuICAgIHJldHVybiBlbGVjdHJvbi5yZW1vdGVbbmFtZV07XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0SXBjKCkge1xuICBpZiAocHJvY2Vzcy50eXBlID09PSAnYnJvd3NlcicgJiYgZWxlY3Ryb24gJiYgZWxlY3Ryb24uaXBjTWFpbikge1xuICAgIHJldHVybiBlbGVjdHJvbi5pcGNNYWluO1xuICB9XG5cbiAgaWYgKHByb2Nlc3MudHlwZSA9PT0gJ3JlbmRlcmVyJyAmJiBlbGVjdHJvbiAmJiBlbGVjdHJvbi5pcGNSZW5kZXJlcikge1xuICAgIHJldHVybiBlbGVjdHJvbi5pcGNSZW5kZXJlcjtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5cbmZ1bmN0aW9uIGdldFBhdGgobmFtZSkge1xuICB2YXIgYXBwID0gZ2V0QXBwKCk7XG4gIGlmICghYXBwKSByZXR1cm4gbnVsbDtcblxuICB0cnkge1xuICAgIHJldHVybiBhcHAuZ2V0UGF0aChuYW1lKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFJlbW90ZSgpIHtcbiAgaWYgKGVsZWN0cm9uICYmIGVsZWN0cm9uLnJlbW90ZSkge1xuICAgIHJldHVybiBlbGVjdHJvbi5yZW1vdGU7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0VmVyc2lvbigpIHtcbiAgdmFyIGFwcCA9IGdldEFwcCgpO1xuICBpZiAoIWFwcCkgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuICd2ZXJzaW9uJyBpbiBhcHAgPyBhcHAudmVyc2lvbiA6IGFwcC5nZXRWZXJzaW9uKCk7XG59XG5cbmZ1bmN0aW9uIGlzRGV2KCkge1xuICAvLyBiYXNlZCBvbiBzaW5kcmVzb3JodXMvZWxlY3Ryb24taXMtZGV2XG4gIHZhciBhcHAgPSBnZXRBcHAoKTtcbiAgaWYgKCFhcHApIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gIWFwcC5pc1BhY2thZ2VkIHx8IHByb2Nlc3MuZW52LkVMRUNUUk9OX0lTX0RFViA9PT0gJzEnO1xufVxuXG5mdW5jdGlvbiBpc0VsZWN0cm9uKCkge1xuICByZXR1cm4gcHJvY2Vzcy50eXBlID09PSAnYnJvd3NlcicgfHwgcHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInO1xufVxuXG4vKipcbiAqIFJldHVybiB0cnVlIGlmIHRoZSBwcm9jZXNzIGxpc3RlbnMgZm9yIHRoZSBJUEMgY2hhbm5lbFxuICogQHBhcmFtIHtzdHJpbmd9IGNoYW5uZWxcbiAqL1xuZnVuY3Rpb24gaXNJcGNDaGFubmVsTGlzdGVuZWQoY2hhbm5lbCkge1xuICB2YXIgaXBjID0gZ2V0SXBjKCk7XG4gIHJldHVybiBpcGMgPyBpcGMubGlzdGVuZXJDb3VudChjaGFubmVsKSA+IDAgOiBmYWxzZTtcbn1cblxuLyoqXG4gKiBUcnkgdG8gbG9hZCB0aGUgbW9kdWxlIGluIHRoZSBvcHBvc2l0ZSBwcm9jZXNzXG4gKiBAcGFyYW0ge3N0cmluZ30gbW9kdWxlTmFtZVxuICovXG5mdW5jdGlvbiBsb2FkUmVtb3RlTW9kdWxlKG1vZHVsZU5hbWUpIHtcbiAgaWYgKHByb2Nlc3MudHlwZSA9PT0gJ2Jyb3dzZXInKSB7XG4gICAgZ2V0QXBwKCkub24oJ3dlYi1jb250ZW50cy1jcmVhdGVkJywgZnVuY3Rpb24gKGUsIGNvbnRlbnRzKSB7XG4gICAgICB2YXIgcHJvbWlzZSA9IGNvbnRlbnRzLmV4ZWN1dGVKYXZhU2NyaXB0KFxuICAgICAgICAndHJ5IHtyZXF1aXJlKFwiJyArIG1vZHVsZU5hbWUgKyAnXCIpfSBjYXRjaChlKXt9OyB2b2lkIDA7J1xuICAgICAgKTtcblxuICAgICAgLy8gRG8gbm90aGluZyBvbiBlcnJvciwganVzdCBwcmV2ZW50IFVuaGFuZGxlZCByZWplY3Rpb25cbiAgICAgIGlmIChwcm9taXNlICYmIHR5cGVvZiBwcm9taXNlLmNhdGNoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHByb21pc2UuY2F0Y2goZnVuY3Rpb24gKCkge30pO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2UgaWYgKHByb2Nlc3MudHlwZSA9PT0gJ3JlbmRlcmVyJykge1xuICAgIHRyeSB7XG4gICAgICBnZXRSZW1vdGUoKS5yZXF1aXJlKG1vZHVsZU5hbWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIENhbid0IGJlIHJlcXVpcmVkLiBXZWJwYWNrP1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIExpc3RlbiB0byBhc3luYyBtZXNzYWdlcyBzZW50IGZyb20gb3Bwb3NpdGUgcHJvY2Vzc1xuICogQHBhcmFtIHtzdHJpbmd9IGNoYW5uZWxcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyXG4gKi9cbmZ1bmN0aW9uIG9uSXBjKGNoYW5uZWwsIGxpc3RlbmVyKSB7XG4gIHZhciBpcGMgPSBnZXRJcGMoKTtcbiAgaWYgKGlwYykge1xuICAgIGlwYy5vbihjaGFubmVsLCBsaXN0ZW5lcik7XG4gIH1cbn1cblxuLyoqXG4gKiBTZW50IGEgbWVzc2FnZSB0byBvcHBvc2l0ZSBwcm9jZXNzXG4gKiBAcGFyYW0ge3N0cmluZ30gY2hhbm5lbFxuICogQHBhcmFtIHthbnl9IG1lc3NhZ2VcbiAqL1xuZnVuY3Rpb24gc2VuZElwYyhjaGFubmVsLCBtZXNzYWdlKSB7XG4gIGlmIChwcm9jZXNzLnR5cGUgPT09ICdicm93c2VyJykge1xuICAgIHNlbmRJcGNUb1JlbmRlcmVyKGNoYW5uZWwsIG1lc3NhZ2UpO1xuICB9IGVsc2UgaWYgKHByb2Nlc3MudHlwZSA9PT0gJ3JlbmRlcmVyJykge1xuICAgIHNlbmRJcGNUb01haW4oY2hhbm5lbCwgbWVzc2FnZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2VuZElwY1RvTWFpbihjaGFubmVsLCBtZXNzYWdlKSB7XG4gIHZhciBpcGMgPSBnZXRJcGMoKTtcbiAgaWYgKGlwYykge1xuICAgIGlwYy5zZW5kKGNoYW5uZWwsIG1lc3NhZ2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNlbmRJcGNUb1JlbmRlcmVyKGNoYW5uZWwsIG1lc3NhZ2UpIHtcbiAgaWYgKCFlbGVjdHJvbiB8fCAhZWxlY3Ryb24uQnJvd3NlcldpbmRvdykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGVsZWN0cm9uLkJyb3dzZXJXaW5kb3cuZ2V0QWxsV2luZG93cygpLmZvckVhY2goZnVuY3Rpb24gKHduZCkge1xuICAgIHduZC53ZWJDb250ZW50cyAmJiB3bmQud2ViQ29udGVudHMuc2VuZChjaGFubmVsLCBtZXNzYWdlKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3dFcnJvckJveCh0aXRsZSwgbWVzc2FnZSkge1xuICB2YXIgZGlhbG9nID0gZ2V0RWxlY3Ryb25Nb2R1bGUoJ2RpYWxvZycpO1xuICBpZiAoIWRpYWxvZykgcmV0dXJuO1xuXG4gIGRpYWxvZy5zaG93RXJyb3JCb3godGl0bGUsIG1lc3NhZ2UpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2F0Y2hFcnJvcnMgPSByZXF1aXJlKCcuL2NhdGNoRXJyb3JzJyk7XG52YXIgZWxlY3Ryb25BcGkgPSByZXF1aXJlKCcuL2VsZWN0cm9uQXBpJyk7XG52YXIgbG9nID0gcmVxdWlyZSgnLi9sb2cnKS5sb2c7XG52YXIgc2NvcGVGYWN0b3J5ID0gcmVxdWlyZSgnLi9zY29wZScpO1xudmFyIHRyYW5zcG9ydENvbnNvbGUgPSByZXF1aXJlKCcuL3RyYW5zcG9ydHMvY29uc29sZScpO1xudmFyIHRyYW5zcG9ydEZpbGUgPSByZXF1aXJlKCcuL3RyYW5zcG9ydHMvZmlsZScpO1xudmFyIHRyYW5zcG9ydElwYyA9IHJlcXVpcmUoJy4vdHJhbnNwb3J0cy9pcGMnKTtcbnZhciB0cmFuc3BvcnRSZW1vdGUgPSByZXF1aXJlKCcuL3RyYW5zcG9ydHMvcmVtb3RlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlKCdkZWZhdWx0Jyk7XG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gbW9kdWxlLmV4cG9ydHM7XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGxvZ0lkXG4gKiBAcmV0dXJuIHtFbGVjdHJvbkxvZy5FbGVjdHJvbkxvZ31cbiAqL1xuZnVuY3Rpb24gY3JlYXRlKGxvZ0lkKSB7XG4gIC8qKlxuICAgKiBAdHlwZSB7RWxlY3Ryb25Mb2cuRWxlY3Ryb25Mb2d9XG4gICAqL1xuICB2YXIgaW5zdGFuY2UgPSB7XG4gICAgY2F0Y2hFcnJvcnM6IGZ1bmN0aW9uIGNhbGxDYXRjaEVycm9ycyhvcHRpb25zKSB7XG4gICAgICB2YXIgb3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIHtcbiAgICAgICAgbG9nOiBpbnN0YW5jZS5lcnJvcixcbiAgICAgICAgc2hvd0RpYWxvZzogcHJvY2Vzcy50eXBlID09PSAnYnJvd3NlcicsXG4gICAgICB9LCBvcHRpb25zIHx8IHt9KTtcblxuICAgICAgY2F0Y2hFcnJvcnMob3B0cyk7XG4gICAgfSxcbiAgICBjcmVhdGU6IGNyZWF0ZSxcbiAgICBmdW5jdGlvbnM6IHt9LFxuICAgIGhvb2tzOiBbXSxcbiAgICBpc0RldjogZWxlY3Ryb25BcGkuaXNEZXYoKSxcbiAgICBsZXZlbHM6IFsnZXJyb3InLCAnd2FybicsICdpbmZvJywgJ3ZlcmJvc2UnLCAnZGVidWcnLCAnc2lsbHknXSxcbiAgICBsb2dJZDogbG9nSWQsXG4gICAgdmFyaWFibGVzOiB7XG4gICAgICBwcm9jZXNzVHlwZTogcHJvY2Vzcy50eXBlLFxuICAgIH0sXG4gIH07XG5cbiAgaW5zdGFuY2Uuc2NvcGUgPSBzY29wZUZhY3RvcnkoaW5zdGFuY2UpO1xuXG4gIGluc3RhbmNlLnRyYW5zcG9ydHMgPSB7XG4gICAgY29uc29sZTogdHJhbnNwb3J0Q29uc29sZShpbnN0YW5jZSksXG4gICAgZmlsZTogdHJhbnNwb3J0RmlsZShpbnN0YW5jZSksXG4gICAgcmVtb3RlOiB0cmFuc3BvcnRSZW1vdGUoaW5zdGFuY2UpLFxuICAgIGlwYzogdHJhbnNwb3J0SXBjKGluc3RhbmNlKSxcbiAgfTtcblxuICBpbnN0YW5jZS5sZXZlbHMuZm9yRWFjaChmdW5jdGlvbiAobGV2ZWwpIHtcbiAgICBpbnN0YW5jZVtsZXZlbF0gPSBsb2cuYmluZChudWxsLCBpbnN0YW5jZSwgeyBsZXZlbDogbGV2ZWwgfSk7XG4gICAgaW5zdGFuY2UuZnVuY3Rpb25zW2xldmVsXSA9IGluc3RhbmNlW2xldmVsXTtcbiAgfSk7XG5cbiAgaW5zdGFuY2UubG9nID0gbG9nLmJpbmQobnVsbCwgaW5zdGFuY2UsIHsgbGV2ZWw6ICdpbmZvJyB9KTtcbiAgaW5zdGFuY2UuZnVuY3Rpb25zLmxvZyA9IGluc3RhbmNlLmxvZztcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjb21wYXJlTGV2ZWxzOiBjb21wYXJlTGV2ZWxzLFxuICBsb2c6IGxvZyxcbiAgcnVuVHJhbnNwb3J0OiBydW5UcmFuc3BvcnQsXG4gIHJ1blRyYW5zcG9ydHM6IHJ1blRyYW5zcG9ydHMsXG59O1xuXG5mdW5jdGlvbiBsb2coZWxlY3Ryb25Mb2csIG9wdGlvbnMpIHtcbiAgdmFyIHRyYW5zcG9ydHMgPSBlbGVjdHJvbkxvZy50cmFuc3BvcnRzO1xuXG4gIHZhciBtZXNzYWdlID0ge1xuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMiksXG4gICAgZGF0ZTogbmV3IERhdGUoKSxcbiAgICBsZXZlbDogb3B0aW9ucy5sZXZlbCxcbiAgICBzY29wZTogb3B0aW9ucy5zY29wZSA/IG9wdGlvbnMuc2NvcGUudG9KU09OKCkgOiBudWxsLFxuICAgIHZhcmlhYmxlczogZWxlY3Ryb25Mb2cudmFyaWFibGVzLFxuICB9O1xuXG4gIHJ1blRyYW5zcG9ydHModHJhbnNwb3J0cywgbWVzc2FnZSwgZWxlY3Ryb25Mb2cpO1xufVxuXG5mdW5jdGlvbiBydW5UcmFuc3BvcnRzKHRyYW5zcG9ydHMsIG1lc3NhZ2UsIGVsZWN0cm9uTG9nKSB7XG4gIGZvciAodmFyIGkgaW4gdHJhbnNwb3J0cykge1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodHJhbnNwb3J0cywgaSkpIHtcbiAgICAgIHJ1blRyYW5zcG9ydCh0cmFuc3BvcnRzW2ldLCBtZXNzYWdlLCBlbGVjdHJvbkxvZyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJ1blRyYW5zcG9ydCh0cmFuc3BvcnQsIG1lc3NhZ2UsIGVsZWN0cm9uTG9nKSB7XG4gIGlmICh0eXBlb2YgdHJhbnNwb3J0ICE9PSAnZnVuY3Rpb24nIHx8IHRyYW5zcG9ydC5sZXZlbCA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoIWNvbXBhcmVMZXZlbHMoZWxlY3Ryb25Mb2cubGV2ZWxzLCB0cmFuc3BvcnQubGV2ZWwsIG1lc3NhZ2UubGV2ZWwpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbWVzc2FnZSA9IHJ1bkhvb2tzKGVsZWN0cm9uTG9nLmhvb2tzLCB0cmFuc3BvcnQsIG1lc3NhZ2UpO1xuXG4gIGlmIChtZXNzYWdlKSB7XG4gICAgdHJhbnNwb3J0KG1lc3NhZ2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbXBhcmVMZXZlbHMobGV2ZWxzLCBwYXNzTGV2ZWwsIGNoZWNrTGV2ZWwpIHtcbiAgdmFyIHBhc3MgPSBsZXZlbHMuaW5kZXhPZihwYXNzTGV2ZWwpO1xuICB2YXIgY2hlY2sgPSBsZXZlbHMuaW5kZXhPZihjaGVja0xldmVsKTtcbiAgaWYgKGNoZWNrID09PSAtMSB8fCBwYXNzID09PSAtMSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGNoZWNrIDw9IHBhc3M7XG59XG5cbmZ1bmN0aW9uIHJ1bkhvb2tzKGhvb2tzLCB0cmFuc3BvcnQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFob29rcyB8fCAhaG9va3MubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG1lc3NhZ2U7XG4gIH1cblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGx1c3BsdXNcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBob29rcy5sZW5ndGg7IGkrKykge1xuICAgIG1lc3NhZ2UgPSBob29rc1tpXShtZXNzYWdlLCB0cmFuc3BvcnQpO1xuICAgIGlmICghbWVzc2FnZSkgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gbWVzc2FnZTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGxvZyA9IHJlcXVpcmUoJy4vbG9nJykubG9nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNjb3BlRmFjdG9yeTtcblxuLyoqXG4gKiBAcGFyYW0ge0VsZWN0cm9uTG9nLkVsZWN0cm9uTG9nfSBlbGVjdHJvbkxvZ1xuICogQHJldHVybiB7RWxlY3Ryb25Mb2cuU2NvcGV9XG4gKi9cbmZ1bmN0aW9uIHNjb3BlRmFjdG9yeShlbGVjdHJvbkxvZykge1xuICBzY29wZS5sYWJlbFBhZGRpbmcgPSB0cnVlO1xuICBzY29wZS5kZWZhdWx0TGFiZWwgPSAnJztcblxuICAvKiogQHByaXZhdGUgKi9cbiAgc2NvcGUubWF4TGFiZWxMZW5ndGggPSAwO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7dHlwZW9mIGdldE9wdGlvbnN9XG4gICAqIEBwYWNrYWdlXG4gICAqL1xuICBzY29wZS5nZXRPcHRpb25zID0gZ2V0T3B0aW9ucztcblxuICByZXR1cm4gc2NvcGU7XG5cbiAgZnVuY3Rpb24gc2NvcGUobGFiZWwpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSB7XG4gICAgICBsYWJlbDogbGFiZWwsXG4gICAgICB0b0pTT046IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsYWJlbDogdGhpcy5sYWJlbCxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIGVsZWN0cm9uTG9nLmxldmVscy5mb3JFYWNoKGZ1bmN0aW9uIChsZXZlbCkge1xuICAgICAgaW5zdGFuY2VbbGV2ZWxdID0gbG9nLmJpbmQobnVsbCwgZWxlY3Ryb25Mb2csIHtcbiAgICAgICAgbGV2ZWw6IGxldmVsLFxuICAgICAgICBzY29wZTogaW5zdGFuY2UsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGluc3RhbmNlLmxvZyA9IGluc3RhbmNlLmluZm87XG5cbiAgICBzY29wZS5tYXhMYWJlbExlbmd0aCA9IE1hdGgubWF4KHNjb3BlLm1heExhYmVsTGVuZ3RoLCBsYWJlbC5sZW5ndGgpO1xuXG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0T3B0aW9ucygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVmYXVsdExhYmVsOiBzY29wZS5kZWZhdWx0TGFiZWwsXG4gICAgICBsYWJlbExlbmd0aDogZ2V0TGFiZWxMZW5ndGgoKSxcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGFiZWxMZW5ndGgoKSB7XG4gICAgaWYgKHNjb3BlLmxhYmVsUGFkZGluZyA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIHNjb3BlLm1heExhYmVsTGVuZ3RoO1xuICAgIH1cblxuICAgIGlmIChzY29wZS5sYWJlbFBhZGRpbmcgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHNjb3BlLmxhYmVsUGFkZGluZyA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiBzY29wZS5sYWJlbFBhZGRpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG9iamVjdCA9IHJlcXVpcmUoJy4vb2JqZWN0Jyk7XG52YXIgc3R5bGUgPSByZXF1aXJlKCcuL3N0eWxlJyk7XG52YXIgdGVtcGxhdGUgPSByZXF1aXJlKCcuL3RlbXBsYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhcHBseUFuc2lTdHlsZXM6IHN0eWxlLmFwcGx5QW5zaVN0eWxlcyxcbiAgY29uY2F0Rmlyc3RTdHJpbmdFbGVtZW50czogdGVtcGxhdGUuY29uY2F0Rmlyc3RTdHJpbmdFbGVtZW50cyxcbiAgY3VzdG9tRm9ybWF0dGVyRmFjdG9yeTogY3VzdG9tRm9ybWF0dGVyRmFjdG9yeSxcbiAgbWF4RGVwdGhGYWN0b3J5OiBvYmplY3QubWF4RGVwdGhGYWN0b3J5LFxuICByZW1vdmVTdHlsZXM6IHN0eWxlLnJlbW92ZVN0eWxlcyxcbiAgdG9KU09OOiBvYmplY3QudG9KU09OLFxuICB0b1N0cmluZzogb2JqZWN0LnRvU3RyaW5nLFxuICB0cmFuc2Zvcm06IHRyYW5zZm9ybSxcbn07XG5cbmZ1bmN0aW9uIGN1c3RvbUZvcm1hdHRlckZhY3RvcnkoY3VzdG9tRm9ybWF0LCBjb25jYXRGaXJzdCwgc2NvcGVPcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgY3VzdG9tRm9ybWF0ID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmdW5jdGlvbiBjdXN0b21TdHJpbmdGb3JtYXR0ZXIoZGF0YSwgbWVzc2FnZSkge1xuICAgICAgcmV0dXJuIHRyYW5zZm9ybShtZXNzYWdlLCBbXG4gICAgICAgIHRlbXBsYXRlLnRlbXBsYXRlVmFyaWFibGVzLFxuICAgICAgICB0ZW1wbGF0ZS50ZW1wbGF0ZVNjb3BlRmFjdG9yeShzY29wZU9wdGlvbnMpLFxuICAgICAgICB0ZW1wbGF0ZS50ZW1wbGF0ZURhdGUsXG4gICAgICAgIHRlbXBsYXRlLnRlbXBsYXRlVGV4dCxcbiAgICAgICAgY29uY2F0Rmlyc3QgJiYgdGVtcGxhdGUuY29uY2F0Rmlyc3RTdHJpbmdFbGVtZW50cyxcbiAgICAgIF0sIFtjdXN0b21Gb3JtYXRdLmNvbmNhdChkYXRhKSk7XG4gICAgfTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgY3VzdG9tRm9ybWF0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGN1c3RvbUZ1bmN0aW9uRm9ybWF0dGVyKGRhdGEsIG1lc3NhZ2UpIHtcbiAgICAgIHZhciBtb2RpZmllZE1lc3NhZ2UgPSBPYmplY3QuYXNzaWduKHt9LCBtZXNzYWdlLCB7IGRhdGE6IGRhdGEgfSk7XG4gICAgICB2YXIgdGV4dHMgPSBjdXN0b21Gb3JtYXQobW9kaWZpZWRNZXNzYWdlLCBkYXRhKTtcbiAgICAgIHJldHVybiBbXS5jb25jYXQodGV4dHMpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICByZXR1cm4gW10uY29uY2F0KGRhdGEpO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0cmFuc2Zvcm0obWVzc2FnZSwgdHJhbnNmb3JtZXJzLCBpbml0aWFsRGF0YSkge1xuICByZXR1cm4gdHJhbnNmb3JtZXJzLnJlZHVjZShmdW5jdGlvbiAoZGF0YSwgdHJhbnNmb3JtZXIpIHtcbiAgICBpZiAodHlwZW9mIHRyYW5zZm9ybWVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdHJhbnNmb3JtZXIoZGF0YSwgbWVzc2FnZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH0sIGluaXRpYWxEYXRhIHx8IG1lc3NhZ2UuZGF0YSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWF4RGVwdGhGYWN0b3J5OiBtYXhEZXB0aEZhY3RvcnksXG4gIHNlcmlhbGl6ZTogc2VyaWFsaXplLFxuICB0b0pTT046IHRvSlNPTixcbiAgdG9TdHJpbmc6IHRvU3RyaW5nLFxufTtcblxuZnVuY3Rpb24gY3JlYXRlU2VyaWFsaXplcigpIHtcbiAgdmFyIHNlZW4gPSBjcmVhdGVXZWFrU2V0KCk7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICAgIGlmIChzZWVuLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgc2Vlbi5hZGQodmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiBzZXJpYWxpemUoa2V5LCB2YWx1ZSk7XG4gIH07XG59XG5cbi8qKlxuICogQHJldHVybiB7V2Vha1NldDxvYmplY3Q+fVxuICovXG5mdW5jdGlvbiBjcmVhdGVXZWFrU2V0KCkge1xuICBpZiAodHlwZW9mIFdlYWtTZXQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIG5ldyBXZWFrU2V0KCk7XG4gIH1cblxuICB2YXIgY2FjaGUgPSBbXTtcbiAgdGhpcy5hZGQgPSBmdW5jdGlvbiAodmFsdWUpIHsgY2FjaGUucHVzaCh2YWx1ZSkgfTtcbiAgdGhpcy5oYXMgPSBmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIGNhY2hlLmluZGV4T2YodmFsdWUpICE9PSAtMSB9O1xuXG4gIHJldHVybiB0aGlzO1xufVxuXG5mdW5jdGlvbiBtYXhEZXB0aChkYXRhLCBkZXB0aCkge1xuICBpZiAoIWRhdGEpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGlmIChkZXB0aCA8IDEpIHtcbiAgICBpZiAoZGF0YS5tYXApIHJldHVybiAnW2FycmF5XSc7XG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JykgcmV0dXJuICdbb2JqZWN0XSc7XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZGF0YS5tYXAgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZGF0YS5tYXAoZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICByZXR1cm4gbWF4RGVwdGgoY2hpbGQsIGRlcHRoIC0gMSk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAodHlwZW9mIGRhdGEgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBpZiAoZGF0YSAmJiB0eXBlb2YgZGF0YS50b0lTT1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgLy8gbm9pbnNwZWN0aW9uIFBvaW50bGVzc0Jvb2xlYW5FeHByZXNzaW9uSlNcbiAgaWYgKGRhdGEgPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChkYXRhIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIHZhciBuZXdKc29uID0ge307XG4gIGZvciAodmFyIGkgaW4gZGF0YSkge1xuICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGkpKSBjb250aW51ZTtcbiAgICBuZXdKc29uW2ldID0gbWF4RGVwdGgoZGF0YVtpXSwgZGVwdGggLSAxKTtcbiAgfVxuXG4gIHJldHVybiBuZXdKc29uO1xufVxuXG5mdW5jdGlvbiBtYXhEZXB0aEZhY3RvcnkoZGVwdGgpIHtcbiAgZGVwdGggPSBkZXB0aCB8fCA2O1xuXG4gIHJldHVybiBmdW5jdGlvbiBtYXhEZXB0aEZ1bmN0aW9uKGRhdGEpIHtcbiAgICByZXR1cm4gbWF4RGVwdGgoZGF0YSwgZGVwdGgpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBzZXJpYWxpemUoa2V5LCB2YWx1ZSkge1xuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgIHZhciBvYmplY3QgPSBPYmplY3QuYXNzaWduKFxuICAgICAge1xuICAgICAgICBjb25zdHJ1Y3RvcjogKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLm5hbWUpIHx8ICdFcnJvcicsXG4gICAgICB9LFxuICAgICAgdmFsdWUsXG4gICAgICB7IHN0YWNrOiB2YWx1ZS5zdGFjayB9XG4gICAgKTtcblxuICAgIGlmICghb2JqZWN0LnN0YWNrKSB7XG4gICAgICBvYmplY3QubWVzc2FnZSA9IHZhbHVlLm1lc3NhZ2U7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLm5hbWUpIHtcbiAgICAgIG9iamVjdC5jb25zdHJ1Y3RvciA9IHZhbHVlLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuXG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB2YWx1ZS50b0pTT04oKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gJ1tmdW5jdGlvbl0gJyArIHZhbHVlLnRvU3RyaW5nKCk7XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHRvSlNPTihkYXRhKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEsIGNyZWF0ZVNlcmlhbGl6ZXIoKSkpO1xufVxuXG5mdW5jdGlvbiB0b1N0cmluZyhkYXRhKSB7XG4gIHZhciBzaW1wbGlmaWVkRGF0YSA9IGRhdGEubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgaWYgKGl0ZW0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShpdGVtLCBjcmVhdGVTZXJpYWxpemVyKCksICcgICcpKTtcbiAgfSk7XG5cbiAgcmV0dXJuIHV0aWwuZm9ybWF0LmFwcGx5KHV0aWwsIHNpbXBsaWZpZWREYXRhKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFwcGx5QW5zaVN0eWxlczogYXBwbHlBbnNpU3R5bGVzLFxuICByZW1vdmVTdHlsZXM6IHJlbW92ZVN0eWxlcyxcbiAgdHJhbnNmb3JtU3R5bGVzOiB0cmFuc2Zvcm1TdHlsZXMsXG59O1xuXG52YXIgQU5TSV9DT0xPUlMgPSB7XG4gIHVuc2V0OiAnXFx4MWJbMG0nLFxuICBibGFjazogJ1xceDFiWzMwbScsXG4gIHJlZDogJ1xceDFiWzMxbScsXG4gIGdyZWVuOiAnXFx4MWJbMzJtJyxcbiAgeWVsbG93OiAnXFx4MWJbMzNtJyxcbiAgYmx1ZTogJ1xceDFiWzM0bScsXG4gIG1hZ2VudGE6ICdcXHgxYlszNW0nLFxuICBjeWFuOiAnXFx4MWJbMzZtJyxcbiAgd2hpdGU6ICdcXHgxYlszN20nLFxufTtcblxuZnVuY3Rpb24gYXBwbHlBbnNpU3R5bGVzKGRhdGEpIHtcbiAgcmV0dXJuIHRyYW5zZm9ybVN0eWxlcyhkYXRhLCBzdHlsZVRvQW5zaSwgcmVzZXRBbnNpU3R5bGUpO1xufVxuXG5mdW5jdGlvbiBzdHlsZVRvQW5zaShzdHlsZSkge1xuICB2YXIgY29sb3IgPSBzdHlsZS5yZXBsYWNlKC9jb2xvcjpcXHMqKFxcdyspLiovLCAnJDEnKS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gQU5TSV9DT0xPUlNbY29sb3JdIHx8ICcnO1xufVxuXG5mdW5jdGlvbiByZXNldEFuc2lTdHlsZShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZyArIEFOU0lfQ09MT1JTLnVuc2V0O1xufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZXMoZGF0YSkge1xuICByZXR1cm4gdHJhbnNmb3JtU3R5bGVzKGRhdGEsIGZ1bmN0aW9uICgpIHsgcmV0dXJuICcnIH0pO1xufVxuXG5mdW5jdGlvbiB0cmFuc2Zvcm1TdHlsZXMoZGF0YSwgb25TdHlsZUZvdW5kLCBvblN0eWxlQXBwbGllZCkge1xuICB2YXIgZm91bmRTdHlsZXMgPSB7fTtcblxuICByZXR1cm4gZGF0YS5yZWR1Y2UoZnVuY3Rpb24gKHJlc3VsdCwgaXRlbSwgaW5kZXgsIGFycmF5KSB7XG4gICAgaWYgKGZvdW5kU3R5bGVzW2luZGV4XSkge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YXIgdmFsdWVJbmRleCA9IGluZGV4O1xuICAgICAgdmFyIHN0eWxlQXBwbGllZCA9IGZhbHNlO1xuXG4gICAgICBpdGVtID0gaXRlbS5yZXBsYWNlKC8lWzFjZGZpT29zXS9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgICAgdmFsdWVJbmRleCArPSAxO1xuXG4gICAgICAgIGlmIChtYXRjaCAhPT0gJyVjJykge1xuICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzdHlsZSA9IGFycmF5W3ZhbHVlSW5kZXhdO1xuICAgICAgICBpZiAodHlwZW9mIHN0eWxlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGZvdW5kU3R5bGVzW3ZhbHVlSW5kZXhdID0gdHJ1ZTtcbiAgICAgICAgICBzdHlsZUFwcGxpZWQgPSB0cnVlO1xuICAgICAgICAgIHJldHVybiBvblN0eWxlRm91bmQoc3R5bGUsIGl0ZW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChzdHlsZUFwcGxpZWQgJiYgb25TdHlsZUFwcGxpZWQpIHtcbiAgICAgICAgaXRlbSA9IG9uU3R5bGVBcHBsaWVkKGl0ZW0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sIFtdKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbmNhdEZpcnN0U3RyaW5nRWxlbWVudHM6IGNvbmNhdEZpcnN0U3RyaW5nRWxlbWVudHMsXG4gIGZvcm1hdERhdGU6IGZvcm1hdERhdGUsXG4gIGZvcm1hdFRpbWVab25lOiBmb3JtYXRUaW1lWm9uZSxcbiAgcGFkOiBwYWQsXG4gIHBhZFN0cmluZzogcGFkU3RyaW5nLFxuICB0ZW1wbGF0ZURhdGU6IHRlbXBsYXRlRGF0ZSxcbiAgdGVtcGxhdGVWYXJpYWJsZXM6IHRlbXBsYXRlVmFyaWFibGVzLFxuICB0ZW1wbGF0ZVNjb3BlRmFjdG9yeTogdGVtcGxhdGVTY29wZUZhY3RvcnksXG4gIHRlbXBsYXRlVGV4dDogdGVtcGxhdGVUZXh0LFxufTtcblxuLyoqXG4gKiBUaGUgZmlyc3QgYXJndW1lbnQgb2YgY29uc29sZS5sb2cgbWF5IGNvbnRhaW4gdGVtcGxhdGVzLiBJbiB0aGUgbGlicmFyeVxuICogdGhlIGZpcnN0IGVsZW1lbnQgaXMgYSBzdHJpbmcgcmVsYXRlZCB0byB0cmFuc3BvcnRzLmNvbnNvbGUuZm9ybWF0LiBTb1xuICogdGhpcyBmdW5jdGlvbiBjb25jYXRlbmF0ZXMgZmlyc3QgdHdvIGVsZW1lbnRzIHRvIG1ha2UgdGVtcGxhdGVzIGxpa2UgJWRcbiAqIHdvcmtcbiAqIEBwYXJhbSB7KltdfSBkYXRhXG4gKiBAcmV0dXJuIHsqW119XG4gKi9cbmZ1bmN0aW9uIGNvbmNhdEZpcnN0U3RyaW5nRWxlbWVudHMoZGF0YSkge1xuICBpZiAodHlwZW9mIGRhdGFbMF0gIT09ICdzdHJpbmcnIHx8IHR5cGVvZiBkYXRhWzFdICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgaWYgKGRhdGFbMF0ubWF0Y2goLyVbMWNkZmlPb3NdLykpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGRhdGFbMV0gPSBkYXRhWzBdICsgJyAnICsgZGF0YVsxXTtcbiAgZGF0YS5zaGlmdCgpO1xuXG4gIHJldHVybiBkYXRhO1xufVxuXG5mdW5jdGlvbiBmb3JtYXREYXRlKHRlbXBsYXRlLCBkYXRlKSB7XG4gIHJldHVybiB0ZW1wbGF0ZVxuICAgIC5yZXBsYWNlKCd7eX0nLCBTdHJpbmcoZGF0ZS5nZXRGdWxsWWVhcigpKSlcbiAgICAucmVwbGFjZSgne219JywgcGFkKGRhdGUuZ2V0TW9udGgoKSArIDEpKVxuICAgIC5yZXBsYWNlKCd7ZH0nLCBwYWQoZGF0ZS5nZXREYXRlKCkpKVxuICAgIC5yZXBsYWNlKCd7aH0nLCBwYWQoZGF0ZS5nZXRIb3VycygpKSlcbiAgICAucmVwbGFjZSgne2l9JywgcGFkKGRhdGUuZ2V0TWludXRlcygpKSlcbiAgICAucmVwbGFjZSgne3N9JywgcGFkKGRhdGUuZ2V0U2Vjb25kcygpKSlcbiAgICAucmVwbGFjZSgne21zfScsIHBhZChkYXRlLmdldE1pbGxpc2Vjb25kcygpLCAzKSlcbiAgICAucmVwbGFjZSgne3p9JywgZm9ybWF0VGltZVpvbmUoZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpKSlcbiAgICAucmVwbGFjZSgne2lzb30nLCBkYXRlLnRvSVNPU3RyaW5nKCkpO1xufVxuXG5mdW5jdGlvbiBmb3JtYXRUaW1lWm9uZShtaW51dGVzT2Zmc2V0KSB7XG4gIHZhciBtID0gTWF0aC5hYnMobWludXRlc09mZnNldCk7XG4gIHJldHVybiAobWludXRlc09mZnNldCA+PSAwID8gJy0nIDogJysnKVxuICAgICsgcGFkKE1hdGguZmxvb3IobSAvIDYwKSkgKyAnOidcbiAgICArIHBhZChtICUgNjApO1xufVxuXG5mdW5jdGlvbiBwYWQobnVtYmVyLCB6ZXJvcykge1xuICB6ZXJvcyA9IHplcm9zIHx8IDI7XG4gIHJldHVybiAobmV3IEFycmF5KHplcm9zICsgMSkuam9pbignMCcpICsgbnVtYmVyKS5zdWJzdHIoLXplcm9zLCB6ZXJvcyk7XG59XG5cbmZ1bmN0aW9uIHBhZFN0cmluZyh2YWx1ZSwgbGVuZ3RoKSB7XG4gIGxlbmd0aCA9IE1hdGgubWF4KGxlbmd0aCwgdmFsdWUubGVuZ3RoKTtcbiAgdmFyIHBhZFZhbHVlID0gQXJyYXkobGVuZ3RoICsgMSkuam9pbignICcpO1xuICByZXR1cm4gKHZhbHVlICsgcGFkVmFsdWUpLnN1YnN0cmluZygwLCBsZW5ndGgpO1xufVxuXG5mdW5jdGlvbiB0ZW1wbGF0ZURhdGUoZGF0YSwgbWVzc2FnZSkge1xuICB2YXIgdGVtcGxhdGUgPSBkYXRhWzBdO1xuICBpZiAodHlwZW9mIHRlbXBsYXRlICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgZGF0YVswXSA9IGZvcm1hdERhdGUodGVtcGxhdGUsIG1lc3NhZ2UuZGF0ZSk7XG4gIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7eyBsYWJlbExlbmd0aDogbnVtYmVyLCBkZWZhdWx0TGFiZWw6IHN0cmluZyB9fSBvcHRpb25zXG4gKi9cbmZ1bmN0aW9uIHRlbXBsYXRlU2NvcGVGYWN0b3J5KG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIHZhciBsYWJlbExlbmd0aCA9IG9wdGlvbnMubGFiZWxMZW5ndGggfHwgMDtcblxuICByZXR1cm4gZnVuY3Rpb24gdGVtcGxhdGVTY29wZShkYXRhLCBtZXNzYWdlKSB7XG4gICAgdmFyIHRlbXBsYXRlID0gZGF0YVswXTtcbiAgICB2YXIgbGFiZWwgPSBtZXNzYWdlLnNjb3BlICYmIG1lc3NhZ2Uuc2NvcGUubGFiZWw7XG5cbiAgICBpZiAoIWxhYmVsKSB7XG4gICAgICBsYWJlbCA9IG9wdGlvbnMuZGVmYXVsdExhYmVsO1xuICAgIH1cblxuICAgIHZhciBzY29wZVRleHQ7XG4gICAgaWYgKGxhYmVsID09PSAnJykge1xuICAgICAgc2NvcGVUZXh0ID0gbGFiZWxMZW5ndGggPiAwID8gcGFkU3RyaW5nKCcnLCBsYWJlbExlbmd0aCArIDMpIDogJyc7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbGFiZWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICBzY29wZVRleHQgPSBwYWRTdHJpbmcoJyAoJyArIGxhYmVsICsgJyknLCBsYWJlbExlbmd0aCArIDMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY29wZVRleHQgPSAnJztcbiAgICB9XG5cbiAgICBkYXRhWzBdID0gdGVtcGxhdGUucmVwbGFjZSgne3Njb3BlfScsIHNjb3BlVGV4dCk7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRlbXBsYXRlVmFyaWFibGVzKGRhdGEsIG1lc3NhZ2UpIHtcbiAgdmFyIHRlbXBsYXRlID0gZGF0YVswXTtcbiAgdmFyIHZhcmlhYmxlcyA9IG1lc3NhZ2UudmFyaWFibGVzO1xuXG4gIGlmICh0eXBlb2YgdGVtcGxhdGUgIT09ICdzdHJpbmcnIHx8ICFtZXNzYWdlLnZhcmlhYmxlcykge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgZm9yICh2YXIgaSBpbiB2YXJpYWJsZXMpIHtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YXJpYWJsZXMsIGkpKSBjb250aW51ZTtcbiAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UoJ3snICsgaSArICd9JywgdmFyaWFibGVzW2ldKTtcbiAgfVxuXG4gIHRlbXBsYXRlID0gdGVtcGxhdGUucmVwbGFjZSgne2xldmVsfScsIG1lc3NhZ2UubGV2ZWwpO1xuXG4gIGRhdGFbMF0gPSB0ZW1wbGF0ZTtcbiAgcmV0dXJuIGRhdGE7XG59XG5cbmZ1bmN0aW9uIHRlbXBsYXRlVGV4dChkYXRhKSB7XG4gIHZhciB0ZW1wbGF0ZSA9IGRhdGFbMF07XG4gIGlmICh0eXBlb2YgdGVtcGxhdGUgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICB2YXIgdGV4dFRwbFBvc2l0aW9uID0gdGVtcGxhdGUubGFzdEluZGV4T2YoJ3t0ZXh0fScpO1xuICBpZiAodGV4dFRwbFBvc2l0aW9uID09PSB0ZW1wbGF0ZS5sZW5ndGggLSA2KSB7XG4gICAgZGF0YVswXSA9IHRlbXBsYXRlLnJlcGxhY2UoL1xccz97dGV4dH0vLCAnJyk7XG4gICAgaWYgKGRhdGFbMF0gPT09ICcnKSB7XG4gICAgICBkYXRhLnNoaWZ0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICB2YXIgdGVtcGxhdGVQaWVjZXMgPSB0ZW1wbGF0ZS5zcGxpdCgne3RleHR9Jyk7XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICBpZiAodGVtcGxhdGVQaWVjZXNbMF0gIT09ICcnKSB7XG4gICAgcmVzdWx0LnB1c2godGVtcGxhdGVQaWVjZXNbMF0pO1xuICB9XG5cbiAgcmVzdWx0ID0gcmVzdWx0LmNvbmNhdChkYXRhLnNsaWNlKDEpKTtcblxuICBpZiAodGVtcGxhdGVQaWVjZXNbMV0gIT09ICcnKSB7XG4gICAgcmVzdWx0LnB1c2godGVtcGxhdGVQaWVjZXNbMV0pO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLyogZXNsaW50LWRpc2FibGUgbm8tbXVsdGktc3BhY2VzLCBuby1jb25zb2xlICovXG5cbnZhciB0cmFuc2Zvcm0gPSByZXF1aXJlKCcuLi90cmFuc2Zvcm0nKTtcblxudmFyIG9yaWdpbmFsID0ge1xuICBjb250ZXh0OiBjb25zb2xlLFxuICBlcnJvcjogICBjb25zb2xlLmVycm9yLFxuICB3YXJuOiAgICBjb25zb2xlLndhcm4sXG4gIGluZm86ICAgIGNvbnNvbGUuaW5mbyxcbiAgdmVyYm9zZTogY29uc29sZS52ZXJib3NlLFxuICBkZWJ1ZzogICBjb25zb2xlLmRlYnVnLFxuICBzaWxseTogICBjb25zb2xlLnNpbGx5LFxuICBsb2c6ICAgICBjb25zb2xlLmxvZyxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29uc29sZVRyYW5zcG9ydEZhY3Rvcnk7XG5tb2R1bGUuZXhwb3J0cy50cmFuc2Zvcm1SZW5kZXJlciA9IHRyYW5zZm9ybVJlbmRlcmVyO1xubW9kdWxlLmV4cG9ydHMudHJhbnNmb3JtTWFpbiA9IHRyYW5zZm9ybU1haW47XG5cbnZhciBzZXBhcmF0b3IgPSBwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInID8gJz4nIDogJ+KAuic7XG52YXIgREVGQVVMVF9GT1JNQVQgPSB7XG4gIGJyb3dzZXI6ICclY3tofTp7aX06e3N9Lnttc317c2NvcGV9JWMgJyArIHNlcGFyYXRvciArICcge3RleHR9JyxcbiAgcmVuZGVyZXI6ICd7aH06e2l9OntzfS57bXN9e3Njb3BlfSDigLoge3RleHR9JyxcbiAgd29ya2VyOiAne2h9OntpfTp7c30ue21zfXtzY29wZX0g4oC6IHt0ZXh0fScsXG59O1xuXG5mdW5jdGlvbiBjb25zb2xlVHJhbnNwb3J0RmFjdG9yeShlbGVjdHJvbkxvZykge1xuICB0cmFuc3BvcnQubGV2ZWwgID0gJ3NpbGx5JztcbiAgdHJhbnNwb3J0LnVzZVN0eWxlcyA9IHByb2Nlc3MuZW52LkZPUkNFX1NUWUxFUztcbiAgdHJhbnNwb3J0LmZvcm1hdCA9IERFRkFVTFRfRk9STUFUW3Byb2Nlc3MudHlwZV0gfHwgREVGQVVMVF9GT1JNQVQuYnJvd3NlcjtcblxuICByZXR1cm4gdHJhbnNwb3J0O1xuXG4gIGZ1bmN0aW9uIHRyYW5zcG9ydChtZXNzYWdlKSB7XG4gICAgdmFyIHNjb3BlT3B0aW9ucyA9IGVsZWN0cm9uTG9nLnNjb3BlLmdldE9wdGlvbnMoKTtcblxuICAgIHZhciBkYXRhO1xuICAgIGlmIChwcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicgfHwgcHJvY2Vzcy50eXBlID09PSAnd29ya2VyJykge1xuICAgICAgZGF0YSA9IHRyYW5zZm9ybVJlbmRlcmVyKG1lc3NhZ2UsIHRyYW5zcG9ydCwgc2NvcGVPcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IHRyYW5zZm9ybU1haW4obWVzc2FnZSwgdHJhbnNwb3J0LCBzY29wZU9wdGlvbnMpO1xuICAgIH1cblxuICAgIGNvbnNvbGVMb2cobWVzc2FnZS5sZXZlbCwgZGF0YSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdHJhbnNmb3JtUmVuZGVyZXIobWVzc2FnZSwgdHJhbnNwb3J0LCBzY29wZU9wdGlvbnMpIHtcbiAgcmV0dXJuIHRyYW5zZm9ybS50cmFuc2Zvcm0obWVzc2FnZSwgW1xuICAgIHRyYW5zZm9ybS5jdXN0b21Gb3JtYXR0ZXJGYWN0b3J5KHRyYW5zcG9ydC5mb3JtYXQsIHRydWUsIHNjb3BlT3B0aW9ucyksXG4gIF0pO1xufVxuXG5mdW5jdGlvbiB0cmFuc2Zvcm1NYWluKG1lc3NhZ2UsIHRyYW5zcG9ydCwgc2NvcGVPcHRpb25zKSB7XG4gIHZhciB1c2VTdHlsZXMgPSBjYW5Vc2VTdHlsZXModHJhbnNwb3J0LnVzZVN0eWxlcywgbWVzc2FnZS5sZXZlbCk7XG5cbiAgcmV0dXJuIHRyYW5zZm9ybS50cmFuc2Zvcm0obWVzc2FnZSwgW1xuICAgIGFkZFRlbXBsYXRlQ29sb3JGYWN0b3J5KHRyYW5zcG9ydC5mb3JtYXQpLFxuICAgIHRyYW5zZm9ybS5jdXN0b21Gb3JtYXR0ZXJGYWN0b3J5KHRyYW5zcG9ydC5mb3JtYXQsIGZhbHNlLCBzY29wZU9wdGlvbnMpLFxuICAgIHVzZVN0eWxlcyA/IHRyYW5zZm9ybS5hcHBseUFuc2lTdHlsZXMgOiB0cmFuc2Zvcm0ucmVtb3ZlU3R5bGVzLFxuICAgIHRyYW5zZm9ybS5jb25jYXRGaXJzdFN0cmluZ0VsZW1lbnRzLFxuICAgIHRyYW5zZm9ybS5tYXhEZXB0aEZhY3RvcnkoNCksXG4gICAgdHJhbnNmb3JtLnRvSlNPTixcbiAgXSk7XG59XG5cbmZ1bmN0aW9uIGFkZFRlbXBsYXRlQ29sb3JGYWN0b3J5KGZvcm1hdCkge1xuICByZXR1cm4gZnVuY3Rpb24gYWRkVGVtcGxhdGVDb2xvcnMoZGF0YSwgbWVzc2FnZSkge1xuICAgIGlmIChmb3JtYXQgIT09IERFRkFVTFRfRk9STUFULmJyb3dzZXIpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIHJldHVybiBbJ2NvbG9yOicgKyBsZXZlbFRvU3R5bGUobWVzc2FnZS5sZXZlbCksICdjb2xvcjp1bnNldCddLmNvbmNhdChkYXRhKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2FuVXNlU3R5bGVzKHVzZVN0eWxlVmFsdWUsIGxldmVsKSB7XG4gIGlmICh1c2VTdHlsZVZhbHVlID09PSB0cnVlIHx8IHVzZVN0eWxlVmFsdWUgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIHVzZVN0eWxlVmFsdWU7XG4gIH1cblxuICB2YXIgdXNlU3RkZXJyID0gbGV2ZWwgPT09ICdlcnJvcicgfHwgbGV2ZWwgPT09ICd3YXJuJztcbiAgdmFyIHN0cmVhbSA9IHVzZVN0ZGVyciA/IHByb2Nlc3Muc3RkZXJyIDogcHJvY2Vzcy5zdGRvdXQ7XG4gIHJldHVybiBzdHJlYW0gJiYgc3RyZWFtLmlzVFRZO1xufVxuXG5mdW5jdGlvbiBjb25zb2xlTG9nKGxldmVsLCBhcmdzKSB7XG4gIGlmIChvcmlnaW5hbFtsZXZlbF0pIHtcbiAgICBvcmlnaW5hbFtsZXZlbF0uYXBwbHkob3JpZ2luYWwuY29udGV4dCwgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgb3JpZ2luYWwubG9nLmFwcGx5KG9yaWdpbmFsLmNvbnRleHQsIGFyZ3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGxldmVsVG9TdHlsZShsZXZlbCkge1xuICBzd2l0Y2ggKGxldmVsKSB7XG4gICAgY2FzZSAnZXJyb3InOiByZXR1cm4gJ3JlZCc7XG4gICAgY2FzZSAnd2Fybic6ICByZXR1cm4gJ3llbGxvdyc7XG4gICAgY2FzZSAnaW5mbyc6ICByZXR1cm4gJ2N5YW4nO1xuICAgIGRlZmF1bHQ6ICAgICAgcmV0dXJuICd1bnNldCc7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpO1xudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBvcyA9IHJlcXVpcmUoJ29zJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgRmlsZTogRmlsZSxcbiAgRmlsZVJlZ2lzdHJ5OiBGaWxlUmVnaXN0cnksXG4gIE51bGxGaWxlOiBOdWxsRmlsZSxcbn07XG5cbi8qKlxuICogRmlsZSBtYW5pcHVsYXRpb25zIG9uIGZpbGVzeXN0ZW1cbiAqIEBjbGFzc1xuICogQGV4dGVuZHMgRXZlbnRFbWl0dGVyXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2l6ZVxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoXG4gKiBAcGFyYW0ge1dyaXRlT3B0aW9uc30gW3dyaXRlT3B0aW9uc11cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3dyaXRlQXN5bmNdXG4gKi9cbmZ1bmN0aW9uIEZpbGUoZmlsZVBhdGgsIHdyaXRlT3B0aW9ucywgd3JpdGVBc3luYykge1xuICBFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcblxuICAvKipcbiAgICogQHR5cGUge3N0cmluZ31cbiAgICogQHJlYWRvbmx5XG4gICAqL1xuICB0aGlzLnBhdGggPSBmaWxlUGF0aDtcblxuICAvKipcbiAgICogQHR5cGUge251bWJlcn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHRoaXMuaW5pdGlhbFNpemUgPSB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgdGhpcy5ieXRlc1dyaXR0ZW4gPSAwO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHRoaXMud3JpdGVBc3luYyA9IEJvb2xlYW4od3JpdGVBc3luYyk7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtzdHJpbmdbXX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHRoaXMuYXN5bmNXcml0ZVF1ZXVlID0gW107XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtXcml0ZU9wdGlvbnN9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0aGlzLndyaXRlT3B0aW9ucyA9IHdyaXRlT3B0aW9ucyB8fCB7XG4gICAgZmxhZzogJ2EnLFxuICAgIG1vZGU6IDQzOCwgLy8gMDY2NlxuICAgIGVuY29kaW5nOiAndXRmOCcsXG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzaXplJywge1xuICAgIGdldDogdGhpcy5nZXRTaXplLmJpbmQodGhpcyksXG4gIH0pO1xufVxuXG51dGlsLmluaGVyaXRzKEZpbGUsIEV2ZW50RW1pdHRlcik7XG5cbkZpbGUucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICB0cnkge1xuICAgIGZzLndyaXRlRmlsZVN5bmModGhpcy5wYXRoLCAnJywge1xuICAgICAgbW9kZTogdGhpcy53cml0ZU9wdGlvbnMubW9kZSxcbiAgICAgIGZsYWc6ICd3JyxcbiAgICB9KTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoZS5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5lbWl0KCdlcnJvcicsIGUsIHRoaXMpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuRmlsZS5wcm90b3R5cGUuY3JvcCA9IGZ1bmN0aW9uIChieXRlc0FmdGVyKSB7XG4gIHRyeSB7XG4gICAgdmFyIGNvbnRlbnQgPSByZWFkRmlsZVN5bmNGcm9tRW5kKHRoaXMucGF0aCwgYnl0ZXNBZnRlciB8fCA0MDk2KTtcbiAgICB0aGlzLmNsZWFyKCk7XG4gICAgdGhpcy53cml0ZUxpbmUoJ1tsb2cgY3JvcHBlZF0nICsgb3MuRU9MICsgY29udGVudCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aGlzLmVtaXQoXG4gICAgICAnZXJyb3InLFxuICAgICAgbmV3IEVycm9yKCdDb3VsZG5cXCd0IGNyb3AgZmlsZSAnICsgdGhpcy5wYXRoICsgJy4gJyArIGUubWVzc2FnZSksXG4gICAgICB0aGlzXG4gICAgKTtcbiAgfVxufTtcblxuRmlsZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnBhdGg7XG59O1xuXG4vKipcbiAqIEBwYWNrYWdlXG4gKi9cbkZpbGUucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmluaXRpYWxTaXplID0gdW5kZWZpbmVkO1xuICB0aGlzLmJ5dGVzV3JpdHRlbiA9IDA7XG59O1xuXG4vKipcbiAqIEBwYWNrYWdlXG4gKi9cbkZpbGUucHJvdG90eXBlLndyaXRlTGluZSA9IGZ1bmN0aW9uICh0ZXh0KSB7XG4gIHRleHQgKz0gb3MuRU9MO1xuXG4gIGlmICh0aGlzLndyaXRlQXN5bmMpIHtcbiAgICB0aGlzLmFzeW5jV3JpdGVRdWV1ZS5wdXNoKHRleHQpO1xuICAgIHRoaXMubmV4dEFzeW5jV3JpdGUoKTtcbiAgICByZXR1cm47XG4gIH1cblxuICB0cnkge1xuICAgIGZzLndyaXRlRmlsZVN5bmModGhpcy5wYXRoLCB0ZXh0LCB0aGlzLndyaXRlT3B0aW9ucyk7XG4gICAgdGhpcy5pbmNyZWFzZUJ5dGVzV3JpdHRlbkNvdW50ZXIodGV4dCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aGlzLmVtaXQoXG4gICAgICAnZXJyb3InLFxuICAgICAgbmV3IEVycm9yKCdDb3VsZG5cXCd0IHdyaXRlIHRvICcgKyB0aGlzLnBhdGggKyAnLiAnICsgZS5tZXNzYWdlKSxcbiAgICAgIHRoaXNcbiAgICApO1xuICB9XG59O1xuXG4vKipcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqIEBwcm90ZWN0ZWRcbiAqL1xuRmlsZS5wcm90b3R5cGUuZ2V0U2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuaW5pdGlhbFNpemUgPT09IHVuZGVmaW5lZCkge1xuICAgIHRyeSB7XG4gICAgICB2YXIgc3RhdHMgPSBmcy5zdGF0U3luYyh0aGlzLnBhdGgpO1xuICAgICAgdGhpcy5pbml0aWFsU2l6ZSA9IHN0YXRzLnNpemU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5pbml0aWFsU2l6ZSA9IDA7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXMuaW5pdGlhbFNpemUgKyB0aGlzLmJ5dGVzV3JpdHRlbjtcbn07XG5cbi8qKlxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqIEBwYWNrYWdlXG4gKi9cbkZpbGUucHJvdG90eXBlLmlzTnVsbCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5GaWxlLnByb3RvdHlwZS5pbmNyZWFzZUJ5dGVzV3JpdHRlbkNvdW50ZXIgPSBmdW5jdGlvbiAodGV4dCkge1xuICB0aGlzLmJ5dGVzV3JpdHRlbiArPSBCdWZmZXIuYnl0ZUxlbmd0aCh0ZXh0LCB0aGlzLndyaXRlT3B0aW9ucy5lbmNvZGluZyk7XG59O1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbkZpbGUucHJvdG90eXBlLm5leHRBc3luY1dyaXRlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZmlsZSA9IHRoaXM7XG5cbiAgaWYgKHRoaXMuYXN5bmNXcml0ZVF1ZXVlLmxlbmd0aCA8IDEpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdGV4dCA9IHRoaXMuYXN5bmNXcml0ZVF1ZXVlLnNoaWZ0KCk7XG5cbiAgZnMud3JpdGVGaWxlKHRoaXMucGF0aCwgdGV4dCwgdGhpcy53cml0ZU9wdGlvbnMsIGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGUpIHtcbiAgICAgIGZpbGUuZW1pdChcbiAgICAgICAgJ2Vycm9yJyxcbiAgICAgICAgbmV3IEVycm9yKCdDb3VsZG5cXCd0IHdyaXRlIHRvICcgKyBmaWxlLnBhdGggKyAnLiAnICsgZS5tZXNzYWdlKSxcbiAgICAgICAgdGhpc1xuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsZS5pbmNyZWFzZUJ5dGVzV3JpdHRlbkNvdW50ZXIodGV4dCk7XG4gICAgfVxuXG4gICAgZmlsZS5uZXh0QXN5bmNXcml0ZSgpO1xuICB9KTtcbn07XG5cbi8qKlxuICogRmlsZSBtYW5pcHVsYXRpb25zIG9uIGZpbGVzeXN0ZW1cbiAqIEBjbGFzc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHNpemVcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aFxuICovXG5mdW5jdGlvbiBOdWxsRmlsZShmaWxlUGF0aCkge1xuICBGaWxlLmNhbGwodGhpcywgZmlsZVBhdGgpO1xufVxuXG51dGlsLmluaGVyaXRzKE51bGxGaWxlLCBGaWxlKTtcblxuTnVsbEZpbGUucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge307XG5OdWxsRmlsZS5wcm90b3R5cGUuY3JvcCA9IGZ1bmN0aW9uICgpIHt9O1xuTnVsbEZpbGUucHJvdG90eXBlLndyaXRlTGluZSA9IGZ1bmN0aW9uICgpIHt9O1xuTnVsbEZpbGUucHJvdG90eXBlLmdldFNpemUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAwIH07XG5OdWxsRmlsZS5wcm90b3R5cGUuaXNOdWxsID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZSB9O1xuXG4vKipcbiAqIENvbGxlY3Rpb24sIGtleSBpcyBhIGZpbGUgcGF0aCwgdmFsdWUgaXMgYSBGaWxlIGluc3RhbmNlXG4gKiBAY2xhc3NcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gRmlsZVJlZ2lzdHJ5KCkge1xuICBFdmVudEVtaXR0ZXIuY2FsbCh0aGlzKTtcbiAgdGhpcy5zdG9yZSA9IHt9O1xuXG4gIHRoaXMuZW1pdEVycm9yID0gdGhpcy5lbWl0RXJyb3IuYmluZCh0aGlzKTtcbn1cblxudXRpbC5pbmhlcml0cyhGaWxlUmVnaXN0cnksIEV2ZW50RW1pdHRlcik7XG5cbi8qKlxuICogUHJvdmlkZSBhIEZpbGUgb2JqZWN0IGNvcnJlc3BvbmRpbmcgdG8gdGhlIGZpbGVQYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGhcbiAqIEBwYXJhbSB7V3JpdGVPcHRpb25zfSBbd3JpdGVPcHRpb25zXVxuICogQHBhcmFtIHtib29sZWFufSBbYXN5bmNdXG4gKiBAcmV0dXJuIHtGaWxlfVxuICovXG5GaWxlUmVnaXN0cnkucHJvdG90eXBlLnByb3ZpZGUgPSBmdW5jdGlvbiAoZmlsZVBhdGgsIHdyaXRlT3B0aW9ucywgYXN5bmMpIHtcbiAgdmFyIGZpbGU7XG4gIHRyeSB7XG4gICAgZmlsZVBhdGggPSBwYXRoLnJlc29sdmUoZmlsZVBhdGgpO1xuXG4gICAgaWYgKHRoaXMuc3RvcmVbZmlsZVBhdGhdKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdG9yZVtmaWxlUGF0aF07XG4gICAgfVxuXG4gICAgZmlsZSA9IHRoaXMuY3JlYXRlRmlsZShmaWxlUGF0aCwgd3JpdGVPcHRpb25zLCBCb29sZWFuKGFzeW5jKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBmaWxlID0gbmV3IE51bGxGaWxlKGZpbGVQYXRoKTtcbiAgICB0aGlzLmVtaXRFcnJvcihlLCBmaWxlKTtcbiAgfVxuXG4gIGZpbGUub24oJ2Vycm9yJywgdGhpcy5lbWl0RXJyb3IpO1xuICB0aGlzLnN0b3JlW2ZpbGVQYXRoXSA9IGZpbGU7XG4gIHJldHVybiBmaWxlO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGhcbiAqIEBwYXJhbSB7V3JpdGVPcHRpb25zfSB3cml0ZU9wdGlvbnNcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYXN5bmNcbiAqIEByZXR1cm4ge0ZpbGV9XG4gKiBAcHJpdmF0ZVxuICovXG5GaWxlUmVnaXN0cnkucHJvdG90eXBlLmNyZWF0ZUZpbGUgPSBmdW5jdGlvbiAoZmlsZVBhdGgsIHdyaXRlT3B0aW9ucywgYXN5bmMpIHtcbiAgdGhpcy50ZXN0RmlsZVdyaXRpbmcoZmlsZVBhdGgpO1xuICByZXR1cm4gbmV3IEZpbGUoZmlsZVBhdGgsIHdyaXRlT3B0aW9ucywgYXN5bmMpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJvclxuICogQHBhcmFtIHtGaWxlfSBmaWxlXG4gKiBAcHJpdmF0ZVxuICovXG5GaWxlUmVnaXN0cnkucHJvdG90eXBlLmVtaXRFcnJvciA9IGZ1bmN0aW9uIChlcnJvciwgZmlsZSkge1xuICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyb3IsIGZpbGUpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGhcbiAqIEBwcml2YXRlXG4gKi9cbkZpbGVSZWdpc3RyeS5wcm90b3R5cGUudGVzdEZpbGVXcml0aW5nID0gZnVuY3Rpb24gKGZpbGVQYXRoKSB7XG4gIG1rRGlyKHBhdGguZGlybmFtZShmaWxlUGF0aCkpO1xuICBmcy53cml0ZUZpbGVTeW5jKGZpbGVQYXRoLCAnJywgeyBmbGFnOiAnYScgfSk7XG59O1xuXG5mdW5jdGlvbiBta0RpcihkaXJQYXRoKSB7XG4gIGlmIChjaGVja05vZGVKc1ZlcnNpb24oMTAuMTIpKSB7XG4gICAgZnMubWtkaXJTeW5jKGRpclBhdGgsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBmcy5ta2RpclN5bmMoZGlyUGF0aCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKGVycm9yLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICByZXR1cm4gbWtEaXIocGF0aC5kaXJuYW1lKGRpclBhdGgpKSAmJiBta0RpcihkaXJQYXRoKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgaWYgKGZzLnN0YXRTeW5jKGRpclBhdGgpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIG5vaW5zcGVjdGlvbiBFeGNlcHRpb25DYXVnaHRMb2NhbGx5SlNcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrTm9kZUpzVmVyc2lvbih2ZXJzaW9uKSB7XG4gIGlmICghcHJvY2Vzcy52ZXJzaW9ucykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBub2RlVmVyc2lvbiA9IE51bWJlcihcbiAgICBwcm9jZXNzLnZlcnNpb24ubWF0Y2goL152KFxcZCtcXC5cXGQrKS8pWzFdLnJlcGxhY2UoL1xcLihcXGQpJC8sICcuMCQxJylcbiAgKTtcblxuICByZXR1cm4gbm9kZVZlcnNpb24gPj0gdmVyc2lvbjtcbn1cblxuZnVuY3Rpb24gcmVhZEZpbGVTeW5jRnJvbUVuZChmaWxlUGF0aCwgYnl0ZXNDb3VudCkge1xuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jKGJ5dGVzQ291bnQpO1xuICB2YXIgc3RhdHMgPSBmcy5zdGF0U3luYyhmaWxlUGF0aCk7XG5cbiAgdmFyIHJlYWRMZW5ndGggPSBNYXRoLm1pbihzdGF0cy5zaXplLCBieXRlc0NvdW50KTtcbiAgdmFyIG9mZnNldCA9IE1hdGgubWF4KDAsIHN0YXRzLnNpemUgLSBieXRlc0NvdW50KTtcblxuICB2YXIgZmQgPSBmcy5vcGVuU3luYyhmaWxlUGF0aCwgJ3InKTtcbiAgdmFyIHRvdGFsQnl0ZXMgPSBmcy5yZWFkU3luYyhmZCwgYnVmZmVyLCAwLCByZWFkTGVuZ3RoLCBvZmZzZXQpO1xuICBmcy5jbG9zZVN5bmMoZmQpO1xuXG4gIHJldHVybiBidWZmZXIudG9TdHJpbmcoJ3V0ZjgnLCAwLCB0b3RhbEJ5dGVzKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgdHJhbnNmb3JtID0gcmVxdWlyZSgnLi4vLi4vdHJhbnNmb3JtJyk7XG52YXIgRmlsZVJlZ2lzdHJ5ID0gcmVxdWlyZSgnLi9maWxlJykuRmlsZVJlZ2lzdHJ5O1xudmFyIHZhcmlhYmxlcyA9IHJlcXVpcmUoJy4vdmFyaWFibGVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZmlsZVRyYW5zcG9ydEZhY3Rvcnk7XG5cbi8vIFNoYXJlZCBiZXR3ZWVuIG11bHRpcGxlIGZpbGUgdHJhbnNwb3J0IGluc3RhbmNlc1xudmFyIGdsb2JhbFJlZ2lzdHJ5ID0gbmV3IEZpbGVSZWdpc3RyeSgpO1xuXG5mdW5jdGlvbiBmaWxlVHJhbnNwb3J0RmFjdG9yeShlbGVjdHJvbkxvZywgY3VzdG9tUmVnaXN0cnkpIHtcbiAgdmFyIHBhdGhWYXJpYWJsZXMgPSB2YXJpYWJsZXMuZ2V0UGF0aFZhcmlhYmxlcyhwcm9jZXNzLnBsYXRmb3JtKTtcblxuICB2YXIgcmVnaXN0cnkgPSBjdXN0b21SZWdpc3RyeSB8fCBnbG9iYWxSZWdpc3RyeTtcbiAgcmVnaXN0cnkub24oJ2Vycm9yJywgZnVuY3Rpb24gKGUsIGZpbGUpIHtcbiAgICBsb2dDb25zb2xlKCdDYW5cXCd0IHdyaXRlIHRvICcgKyBmaWxlLCBlKTtcbiAgfSk7XG5cbiAgLyogZXNsaW50LWRpc2FibGUgbm8tbXVsdGktc3BhY2VzICovXG4gIHRyYW5zcG9ydC5hcmNoaXZlTG9nICAgPSBhcmNoaXZlTG9nO1xuICB0cmFuc3BvcnQuZmlsZU5hbWUgICAgID0gZ2V0RGVmYXVsdEZpbGVOYW1lKCk7XG4gIHRyYW5zcG9ydFxuICAgIC5mb3JtYXQgPSAnW3t5fS17bX0te2R9IHtofTp7aX06e3N9Lnttc31dIFt7bGV2ZWx9XXtzY29wZX0ge3RleHR9JztcbiAgdHJhbnNwb3J0LmdldEZpbGUgICAgICA9IGdldEZpbGU7XG4gIHRyYW5zcG9ydC5sZXZlbCAgICAgICAgPSAnc2lsbHknO1xuICB0cmFuc3BvcnQubWF4U2l6ZSAgICAgID0gMTAyNCAqIDEwMjQ7XG4gIHRyYW5zcG9ydC5yZXNvbHZlUGF0aCAgPSByZXNvbHZlUGF0aDtcbiAgdHJhbnNwb3J0LnN5bmMgICAgICAgICA9IHRydWU7XG4gIHRyYW5zcG9ydC53cml0ZU9wdGlvbnMgPSB7XG4gICAgZmxhZzogJ2EnLFxuICAgIG1vZGU6IDQzOCwgLy8gMDY2NlxuICAgIGVuY29kaW5nOiAndXRmOCcsXG4gIH07XG5cbiAgaW5pdERlcHJlY2F0ZWQoKTtcblxuICByZXR1cm4gdHJhbnNwb3J0O1xuXG4gIGZ1bmN0aW9uIHRyYW5zcG9ydChtZXNzYWdlKSB7XG4gICAgdmFyIGZpbGUgPSBnZXRGaWxlKG1lc3NhZ2UpO1xuXG4gICAgdmFyIG5lZWRMb2dSb3RhdGlvbiA9IHRyYW5zcG9ydC5tYXhTaXplID4gMFxuICAgICAgJiYgZmlsZS5zaXplID4gdHJhbnNwb3J0Lm1heFNpemU7XG5cbiAgICBpZiAobmVlZExvZ1JvdGF0aW9uKSB7XG4gICAgICB0cmFuc3BvcnQuYXJjaGl2ZUxvZyhmaWxlKTtcbiAgICAgIGZpbGUucmVzZXQoKTtcbiAgICB9XG5cbiAgICB2YXIgc2NvcGVPcHRpb25zID0gZWxlY3Ryb25Mb2cuc2NvcGUuZ2V0T3B0aW9ucygpO1xuICAgIHZhciBjb250ZW50ID0gdHJhbnNmb3JtLnRyYW5zZm9ybShtZXNzYWdlLCBbXG4gICAgICB0cmFuc2Zvcm0ucmVtb3ZlU3R5bGVzLFxuICAgICAgdHJhbnNmb3JtLmN1c3RvbUZvcm1hdHRlckZhY3RvcnkodHJhbnNwb3J0LmZvcm1hdCwgZmFsc2UsIHNjb3BlT3B0aW9ucyksXG4gICAgICB0cmFuc2Zvcm0uY29uY2F0Rmlyc3RTdHJpbmdFbGVtZW50cyxcbiAgICAgIHRyYW5zZm9ybS5tYXhEZXB0aEZhY3RvcnkoKSxcbiAgICAgIHRyYW5zZm9ybS50b1N0cmluZyxcbiAgICBdKTtcblxuICAgIGZpbGUud3JpdGVMaW5lKGNvbnRlbnQpO1xuICB9XG5cbiAgZnVuY3Rpb24gYXJjaGl2ZUxvZyhmaWxlKSB7XG4gICAgdmFyIG9sZFBhdGggPSBmaWxlLnRvU3RyaW5nKCk7XG4gICAgdmFyIGluZiA9IHBhdGgucGFyc2Uob2xkUGF0aCk7XG4gICAgdHJ5IHtcbiAgICAgIGZzLnJlbmFtZVN5bmMob2xkUGF0aCwgcGF0aC5qb2luKGluZi5kaXIsIGluZi5uYW1lICsgJy5vbGQnICsgaW5mLmV4dCkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGxvZ0NvbnNvbGUoJ0NvdWxkIG5vdCByb3RhdGUgbG9nJywgZSk7XG4gICAgICB2YXIgcXVhcnRlck9mTWF4U2l6ZSA9IE1hdGgucm91bmQodHJhbnNwb3J0Lm1heFNpemUgLyA0KTtcbiAgICAgIGZpbGUuY3JvcChNYXRoLm1pbihxdWFydGVyT2ZNYXhTaXplLCAyNTYgKiAxMDI0KSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbG9nQ29uc29sZShtZXNzYWdlLCBlcnJvcikge1xuICAgIHZhciBkYXRhID0gWydlbGVjdHJvbi1sb2cudHJhbnNwb3J0cy5maWxlOiAnICsgbWVzc2FnZV07XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGRhdGEucHVzaChlcnJvcik7XG4gICAgfVxuXG4gICAgZWxlY3Ryb25Mb2cudHJhbnNwb3J0cy5jb25zb2xlKHtcbiAgICAgIGRhdGE6IGRhdGEsXG4gICAgICBkYXRlOiBuZXcgRGF0ZSgpLFxuICAgICAgbGV2ZWw6ICd3YXJuJyxcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEZpbGUobXNnKSB7XG4gICAgdmFyIHZhcnMgPSBPYmplY3QuYXNzaWduKHt9LCBwYXRoVmFyaWFibGVzLCB7XG4gICAgICBmaWxlTmFtZTogdHJhbnNwb3J0LmZpbGVOYW1lLFxuICAgIH0pO1xuXG4gICAgdmFyIGZpbGVQYXRoID0gdHJhbnNwb3J0LnJlc29sdmVQYXRoKHZhcnMsIG1zZyk7XG4gICAgcmV0dXJuIHJlZ2lzdHJ5LnByb3ZpZGUoZmlsZVBhdGgsIHRyYW5zcG9ydC53cml0ZU9wdGlvbnMsICF0cmFuc3BvcnQuc3luYyk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtQYXRoVmFyaWFibGVzfSB2YXJzXG4gICAqL1xuICBmdW5jdGlvbiByZXNvbHZlUGF0aCh2YXJzKSB7XG4gICAgcmV0dXJuIHBhdGguam9pbih2YXJzLmxpYnJhcnlEZWZhdWx0RGlyLCB2YXJzLmZpbGVOYW1lKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXREZXByZWNhdGVkKCkge1xuICAgIHZhciBpc0RlcHJlY2F0ZWRUZXh0ID0gJyBpcyBkZXByZWNhdGVkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdjUuJztcbiAgICB2YXIgaXNEZXByZWNhdGVkUHJvcCA9ICcgcHJvcGVydHknICsgaXNEZXByZWNhdGVkVGV4dDtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRyYW5zcG9ydCwge1xuICAgICAgYnl0ZXNXcml0dGVuOiB7XG4gICAgICAgIGdldDogdXRpbC5kZXByZWNhdGUoZ2V0Qnl0ZXNXcml0dGVuLCAnYnl0ZXNXcml0dGVuJyArIGlzRGVwcmVjYXRlZFByb3ApLFxuICAgICAgfSxcblxuICAgICAgZmlsZToge1xuICAgICAgICBnZXQ6IHV0aWwuZGVwcmVjYXRlKGdldExvZ0ZpbGUsICdmaWxlJyArIGlzRGVwcmVjYXRlZFByb3ApLFxuICAgICAgICBzZXQ6IHV0aWwuZGVwcmVjYXRlKHNldExvZ0ZpbGUsICdmaWxlJyArIGlzRGVwcmVjYXRlZFByb3ApLFxuICAgICAgfSxcblxuICAgICAgZmlsZVNpemU6IHtcbiAgICAgICAgZ2V0OiB1dGlsLmRlcHJlY2F0ZShnZXRGaWxlU2l6ZSwgJ2ZpbGUnICsgaXNEZXByZWNhdGVkUHJvcCksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgdHJhbnNwb3J0LmNsZWFyID0gdXRpbC5kZXByZWNhdGUoY2xlYXIsICdjbGVhcigpJyArIGlzRGVwcmVjYXRlZFRleHQpO1xuICAgIHRyYW5zcG9ydC5maW5kTG9nUGF0aCA9IHV0aWwuZGVwcmVjYXRlKFxuICAgICAgZ2V0TG9nRmlsZSxcbiAgICAgICdmaW5kTG9nUGF0aCgpJyArIGlzRGVwcmVjYXRlZFRleHRcbiAgICApO1xuICAgIHRyYW5zcG9ydC5pbml0ID0gdXRpbC5kZXByZWNhdGUoaW5pdCwgJ2luaXQoKScgKyBpc0RlcHJlY2F0ZWRUZXh0KTtcblxuICAgIGZ1bmN0aW9uIGdldEJ5dGVzV3JpdHRlbigpIHtcbiAgICAgIHJldHVybiBnZXRGaWxlKCkuYnl0ZXNXcml0dGVuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldExvZ0ZpbGUoKSB7XG4gICAgICByZXR1cm4gZ2V0RmlsZSgpLnBhdGg7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0TG9nRmlsZShmaWxlUGF0aCkge1xuICAgICAgdHJhbnNwb3J0LnJlc29sdmVQYXRoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZmlsZVBhdGg7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEZpbGVTaXplKCkge1xuICAgICAgcmV0dXJuIGdldEZpbGUoKS5zaXplO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgZ2V0RmlsZSgpLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdCgpIHt9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdEZpbGVOYW1lKCkge1xuICBzd2l0Y2ggKHByb2Nlc3MudHlwZSkge1xuICAgIGNhc2UgJ3JlbmRlcmVyJzogcmV0dXJuICdyZW5kZXJlci5sb2cnO1xuICAgIGNhc2UgJ3dvcmtlcic6IHJldHVybiAnd29ya2VyLmxvZyc7XG4gICAgZGVmYXVsdDogcmV0dXJuICdtYWluLmxvZyc7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLyogZXNsaW50LWRpc2FibGUgY29uc2lzdGVudC1yZXR1cm4gKi9cblxudmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVhZFBhY2thZ2VKc29uOiByZWFkUGFja2FnZUpzb24sXG4gIHRyeVJlYWRKc29uQXQ6IHRyeVJlYWRKc29uQXQsXG59O1xuXG4vKipcbiAqIEByZXR1cm4ge3sgbmFtZT86IHN0cmluZywgdmVyc2lvbj86IHN0cmluZ319XG4gKi9cbmZ1bmN0aW9uIHJlYWRQYWNrYWdlSnNvbigpIHtcbiAgcmV0dXJuIHRyeVJlYWRKc29uQXQocmVxdWlyZS5tYWluICYmIHJlcXVpcmUubWFpbi5maWxlbmFtZSlcbiAgICB8fCB0cnlSZWFkSnNvbkF0KHByb2Nlc3MucmVzb3VyY2VzUGF0aCwgJ2FwcC5hc2FyJylcbiAgICB8fCB0cnlSZWFkSnNvbkF0KHByb2Nlc3MuY3dkKCkpXG4gICAgfHwgeyBuYW1lOiBudWxsLCB2ZXJzaW9uOiBudWxsIH07XG59XG5cbi8qKlxuICogQHBhcmFtIHsuLi5zdHJpbmd9IHNlYXJjaFBhdGhcbiAqIEByZXR1cm4ge3sgbmFtZT86IHN0cmluZywgdmVyc2lvbj86IHN0cmluZyB9IHwgbnVsbH1cbiAqL1xuZnVuY3Rpb24gdHJ5UmVhZEpzb25BdChzZWFyY2hQYXRoKSB7XG4gIHRyeSB7XG4gICAgc2VhcmNoUGF0aCA9IHBhdGguam9pbi5hcHBseShwYXRoLCBhcmd1bWVudHMpO1xuICAgIHZhciBmaWxlTmFtZSA9IGZpbmRVcCgncGFja2FnZS5qc29uJywgc2VhcmNoUGF0aCk7XG4gICAgaWYgKCFmaWxlTmFtZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIGpzb24gPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhmaWxlTmFtZSwgJ3V0ZjgnKSk7XG4gICAgdmFyIG5hbWUgPSBqc29uLnByb2R1Y3ROYW1lIHx8IGpzb24ubmFtZTtcbiAgICBpZiAoIW5hbWUgfHwgbmFtZS50b0xvd2VyQ2FzZSgpID09PSAnZWxlY3Ryb24nKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAoanNvbi5wcm9kdWN0TmFtZSB8fCBqc29uLm5hbWUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIHZlcnNpb246IGpzb24udmVyc2lvbixcbiAgICAgIH07XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZU5hbWVcbiAqIEBwYXJhbSB7c3RyaW5nfSBbY3dkXVxuICogQHJldHVybiB7c3RyaW5nIHwgbnVsbH1cbiAqL1xuZnVuY3Rpb24gZmluZFVwKGZpbGVOYW1lLCBjd2QpIHtcbiAgdmFyIGN1cnJlbnRQYXRoID0gY3dkO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc3RhbnQtY29uZGl0aW9uXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdmFyIHBhcnNlZFBhdGggPSBwYXRoLnBhcnNlKGN1cnJlbnRQYXRoKTtcbiAgICB2YXIgcm9vdCA9IHBhcnNlZFBhdGgucm9vdDtcbiAgICB2YXIgZGlyID0gcGFyc2VkUGF0aC5kaXI7XG5cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4oY3VycmVudFBhdGgsIGZpbGVOYW1lKSkpIHtcbiAgICAgIHJldHVybiBwYXRoLnJlc29sdmUocGF0aC5qb2luKGN1cnJlbnRQYXRoLCBmaWxlTmFtZSkpO1xuICAgIH1cblxuICAgIGlmIChjdXJyZW50UGF0aCA9PT0gcm9vdCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY3VycmVudFBhdGggPSBkaXI7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIG9zID0gcmVxdWlyZSgnb3MnKTtcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xudmFyIGVsZWN0cm9uQXBpID0gcmVxdWlyZSgnLi4vLi4vZWxlY3Ryb25BcGknKTtcbnZhciBwYWNrYWdlSnNvbiA9IHJlcXVpcmUoJy4vcGFja2FnZUpzb24nKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldEFwcERhdGE6IGdldEFwcERhdGEsXG4gIGdldExpYnJhcnlEZWZhdWx0RGlyOiBnZXRMaWJyYXJ5RGVmYXVsdERpcixcbiAgZ2V0TGlicmFyeVRlbXBsYXRlOiBnZXRMaWJyYXJ5VGVtcGxhdGUsXG4gIGdldE5hbWVBbmRWZXJzaW9uOiBnZXROYW1lQW5kVmVyc2lvbixcbiAgZ2V0UGF0aFZhcmlhYmxlczogZ2V0UGF0aFZhcmlhYmxlcyxcbiAgZ2V0VXNlckRhdGE6IGdldFVzZXJEYXRhLFxufTtcblxuZnVuY3Rpb24gZ2V0QXBwRGF0YShwbGF0Zm9ybSkge1xuICB2YXIgYXBwRGF0YSA9IGVsZWN0cm9uQXBpLmdldFBhdGgoJ2FwcERhdGEnKTtcbiAgaWYgKGFwcERhdGEpIHtcbiAgICByZXR1cm4gYXBwRGF0YTtcbiAgfVxuXG4gIHZhciBob21lID0gZ2V0SG9tZSgpO1xuXG4gIHN3aXRjaCAocGxhdGZvcm0pIHtcbiAgICBjYXNlICdkYXJ3aW4nOiB7XG4gICAgICByZXR1cm4gcGF0aC5qb2luKGhvbWUsICdMaWJyYXJ5L0FwcGxpY2F0aW9uIFN1cHBvcnQnKTtcbiAgICB9XG5cbiAgICBjYXNlICd3aW4zMic6IHtcbiAgICAgIHJldHVybiBwcm9jZXNzLmVudi5BUFBEQVRBIHx8IHBhdGguam9pbihob21lLCAnQXBwRGF0YS9Sb2FtaW5nJyk7XG4gICAgfVxuXG4gICAgZGVmYXVsdDoge1xuICAgICAgcmV0dXJuIHByb2Nlc3MuZW52LlhER19DT05GSUdfSE9NRSB8fCBwYXRoLmpvaW4oaG9tZSwgJy5jb25maWcnKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0SG9tZSgpIHtcbiAgcmV0dXJuIG9zLmhvbWVkaXIgPyBvcy5ob21lZGlyKCkgOiBwcm9jZXNzLmVudi5IT01FO1xufVxuXG5mdW5jdGlvbiBnZXRMaWJyYXJ5RGVmYXVsdERpcihwbGF0Zm9ybSwgYXBwTmFtZSkge1xuICBpZiAocGxhdGZvcm0gPT09ICdkYXJ3aW4nKSB7XG4gICAgcmV0dXJuIHBhdGguam9pbihnZXRIb21lKCksICdMaWJyYXJ5L0xvZ3MnLCBhcHBOYW1lKTtcbiAgfVxuXG4gIHJldHVybiBwYXRoLmpvaW4oZ2V0VXNlckRhdGEocGxhdGZvcm0sIGFwcE5hbWUpLCAnbG9ncycpO1xufVxuXG5mdW5jdGlvbiBnZXRMaWJyYXJ5VGVtcGxhdGUocGxhdGZvcm0pIHtcbiAgaWYgKHBsYXRmb3JtID09PSAnZGFyd2luJykge1xuICAgIHJldHVybiBwYXRoLmpvaW4oZ2V0SG9tZSgpLCAnTGlicmFyeS9Mb2dzJywgJ3thcHBOYW1lfScpO1xuICB9XG5cbiAgcmV0dXJuIHBhdGguam9pbihnZXRBcHBEYXRhKHBsYXRmb3JtKSwgJ3thcHBOYW1lfScsICdsb2dzJyk7XG59XG5cbmZ1bmN0aW9uIGdldE5hbWVBbmRWZXJzaW9uKCkge1xuICB2YXIgbmFtZSA9IGVsZWN0cm9uQXBpLmdldE5hbWUoKTtcbiAgdmFyIHZlcnNpb24gPSBlbGVjdHJvbkFwaS5nZXRWZXJzaW9uKCk7XG5cbiAgaWYgKG5hbWUgJiYgdmVyc2lvbikge1xuICAgIHJldHVybiB7IG5hbWU6IG5hbWUsIHZlcnNpb246IHZlcnNpb24gfTtcbiAgfVxuXG4gIHZhciBwYWNrYWdlVmFsdWVzID0gcGFja2FnZUpzb24ucmVhZFBhY2thZ2VKc29uKCk7XG4gIGlmICghbmFtZSkge1xuICAgIG5hbWUgPSBwYWNrYWdlVmFsdWVzLm5hbWU7XG4gIH1cblxuICBpZiAoIXZlcnNpb24pIHtcbiAgICB2ZXJzaW9uID0gcGFja2FnZVZhbHVlcy52ZXJzaW9uO1xuICB9XG5cbiAgcmV0dXJuIHsgbmFtZTogbmFtZSwgdmVyc2lvbjogdmVyc2lvbiB9O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBwbGF0Zm9ybVxuICogQHJldHVybiB7UGF0aFZhcmlhYmxlc31cbiAqL1xuZnVuY3Rpb24gZ2V0UGF0aFZhcmlhYmxlcyhwbGF0Zm9ybSkge1xuICB2YXIgbmFtZUFuZFZlcnNpb24gPSBnZXROYW1lQW5kVmVyc2lvbigpO1xuICB2YXIgYXBwTmFtZSA9IG5hbWVBbmRWZXJzaW9uLm5hbWU7XG4gIHZhciBhcHBWZXJzaW9uID0gbmFtZUFuZFZlcnNpb24udmVyc2lvbjtcblxuICByZXR1cm4ge1xuICAgIGFwcERhdGE6IGdldEFwcERhdGEocGxhdGZvcm0pLFxuICAgIGFwcE5hbWU6IGFwcE5hbWUsXG4gICAgYXBwVmVyc2lvbjogYXBwVmVyc2lvbixcbiAgICBlbGVjdHJvbkRlZmF1bHREaXI6IGVsZWN0cm9uQXBpLmdldFBhdGgoJ2xvZ3MnKSxcbiAgICBob21lOiBnZXRIb21lKCksXG4gICAgbGlicmFyeURlZmF1bHREaXI6IGdldExpYnJhcnlEZWZhdWx0RGlyKHBsYXRmb3JtLCBhcHBOYW1lKSxcbiAgICBsaWJyYXJ5VGVtcGxhdGU6IGdldExpYnJhcnlUZW1wbGF0ZShwbGF0Zm9ybSksXG4gICAgdGVtcDogZWxlY3Ryb25BcGkuZ2V0UGF0aCgndGVtcCcpIHx8IG9zLnRtcGRpcigpLFxuICAgIHVzZXJEYXRhOiBnZXRVc2VyRGF0YShwbGF0Zm9ybSwgYXBwTmFtZSksXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFVzZXJEYXRhKHBsYXRmb3JtLCBhcHBOYW1lKSB7XG4gIHJldHVybiBlbGVjdHJvbkFwaS5nZXRQYXRoKCd1c2VyRGF0YScpXG4gICAgfHwgcGF0aC5qb2luKGdldEFwcERhdGEocGxhdGZvcm0pLCBhcHBOYW1lKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHRyYW5zZm9ybSA9IHJlcXVpcmUoJy4uL3RyYW5zZm9ybScpO1xudmFyIGVsZWN0cm9uQXBpID0gcmVxdWlyZSgnLi4vZWxlY3Ryb25BcGknKTtcbnZhciBsb2cgPSByZXF1aXJlKCcuLi9sb2cuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBpcGNUcmFuc3BvcnRGYWN0b3J5O1xuXG5mdW5jdGlvbiBpcGNUcmFuc3BvcnRGYWN0b3J5KGVsZWN0cm9uTG9nKSB7XG4gIHRyYW5zcG9ydC5ldmVudElkID0gJ19fRUxFQ1RST05fTE9HX0lQQ18nICsgZWxlY3Ryb25Mb2cubG9nSWQgKyAnX18nO1xuICB0cmFuc3BvcnQubGV2ZWwgPSBlbGVjdHJvbkxvZy5pc0RldiA/ICdzaWxseScgOiBmYWxzZTtcblxuICAvLyBQcmV2ZW50IHByb2JsZW1zIHdoZW4gdGhlcmUgYXJlIG11bHRpcGxlIGluc3RhbmNlcyBhZnRlciB3ZWJwYWNrXG4gIGlmIChlbGVjdHJvbkFwaS5pc0lwY0NoYW5uZWxMaXN0ZW5lZCh0cmFuc3BvcnQuZXZlbnRJZCkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge307XG4gIH1cblxuICBlbGVjdHJvbkFwaS5vbklwYyh0cmFuc3BvcnQuZXZlbnRJZCwgZnVuY3Rpb24gKF8sIG1lc3NhZ2UpIHtcbiAgICBtZXNzYWdlLmRhdGUgPSBuZXcgRGF0ZShtZXNzYWdlLmRhdGUpO1xuXG4gICAgbG9nLnJ1blRyYW5zcG9ydChcbiAgICAgIGVsZWN0cm9uTG9nLnRyYW5zcG9ydHMuY29uc29sZSxcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBlbGVjdHJvbkxvZ1xuICAgICk7XG4gIH0pO1xuXG4gIGVsZWN0cm9uQXBpLmxvYWRSZW1vdGVNb2R1bGUoJ2VsZWN0cm9uLWxvZycpO1xuXG4gIHJldHVybiBlbGVjdHJvbkFwaS5pc0VsZWN0cm9uKCkgPyB0cmFuc3BvcnQgOiBudWxsO1xuXG4gIGZ1bmN0aW9uIHRyYW5zcG9ydChtZXNzYWdlKSB7XG4gICAgdmFyIGlwY01lc3NhZ2UgPSBPYmplY3QuYXNzaWduKHt9LCBtZXNzYWdlLCB7XG4gICAgICBkYXRhOiB0cmFuc2Zvcm0udHJhbnNmb3JtKG1lc3NhZ2UsIFtcbiAgICAgICAgdHJhbnNmb3JtLnJlbW92ZVN0eWxlcyxcbiAgICAgICAgdHJhbnNmb3JtLnRvSlNPTixcbiAgICAgICAgdHJhbnNmb3JtLm1heERlcHRoRmFjdG9yeSgzKSxcbiAgICAgIF0pLFxuICAgIH0pO1xuXG4gICAgZWxlY3Ryb25BcGkuc2VuZElwYyh0cmFuc3BvcnQuZXZlbnRJZCwgaXBjTWVzc2FnZSk7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGh0dHAgPSByZXF1aXJlKCdodHRwJyk7XG52YXIgaHR0cHMgPSByZXF1aXJlKCdodHRwcycpO1xudmFyIHVybCA9IHJlcXVpcmUoJ3VybCcpO1xudmFyIGxvZyA9IHJlcXVpcmUoJy4uL2xvZycpO1xudmFyIHRyYW5zZm9ybSA9IHJlcXVpcmUoJy4uL3RyYW5zZm9ybScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbW90ZVRyYW5zcG9ydEZhY3Rvcnk7XG5cbmZ1bmN0aW9uIHJlbW90ZVRyYW5zcG9ydEZhY3RvcnkoZWxlY3Ryb25Mb2cpIHtcbiAgdHJhbnNwb3J0LmNsaWVudCA9IHsgbmFtZTogJ2VsZWN0cm9uLWFwcGxpY2F0aW9uJyB9O1xuICB0cmFuc3BvcnQuZGVwdGggPSA2O1xuICB0cmFuc3BvcnQubGV2ZWwgPSBmYWxzZTtcbiAgdHJhbnNwb3J0LnJlcXVlc3RPcHRpb25zID0ge307XG4gIHRyYW5zcG9ydC51cmwgPSBudWxsO1xuXG4gIHJldHVybiB0cmFuc3BvcnQ7XG5cbiAgZnVuY3Rpb24gdHJhbnNwb3J0KG1lc3NhZ2UpIHtcbiAgICBpZiAoIXRyYW5zcG9ydC51cmwpIHJldHVybjtcblxuICAgIHZhciByZXF1ZXN0ID0gcG9zdCh0cmFuc3BvcnQudXJsLCB0cmFuc3BvcnQucmVxdWVzdE9wdGlvbnMsIHtcbiAgICAgIGNsaWVudDogdHJhbnNwb3J0LmNsaWVudCxcbiAgICAgIGRhdGE6IHRyYW5zZm9ybS50cmFuc2Zvcm0obWVzc2FnZSwgW1xuICAgICAgICB0cmFuc2Zvcm0ucmVtb3ZlU3R5bGVzLFxuICAgICAgICB0cmFuc2Zvcm0udG9KU09OLFxuICAgICAgICB0cmFuc2Zvcm0ubWF4RGVwdGhGYWN0b3J5KHRyYW5zcG9ydC5kZXB0aCArIDEpLFxuICAgICAgXSksXG4gICAgICBkYXRlOiBtZXNzYWdlLmRhdGUuZ2V0VGltZSgpLFxuICAgICAgbGV2ZWw6IG1lc3NhZ2UubGV2ZWwsXG4gICAgICB2YXJpYWJsZXM6IG1lc3NhZ2UudmFyaWFibGVzLFxuICAgIH0pO1xuXG4gICAgcmVxdWVzdC5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIHZhciBlcnJvck1lc3NhZ2UgPSB7XG4gICAgICAgIGRhdGE6IFtcbiAgICAgICAgICAnZWxlY3Ryb24tbG9nLnRyYW5zcG9ydHMucmVtb3RlOidcbiAgICAgICAgICArICcgY2Fubm90IHNlbmQgSFRUUCByZXF1ZXN0IHRvICcgKyB0cmFuc3BvcnQudXJsLFxuICAgICAgICAgIGVycm9yLFxuICAgICAgICBdLFxuICAgICAgICBkYXRlOiBuZXcgRGF0ZSgpLFxuICAgICAgICBsZXZlbDogJ3dhcm4nLFxuICAgICAgfTtcblxuICAgICAgdmFyIHRyYW5zcG9ydHMgPSBbXG4gICAgICAgIGVsZWN0cm9uTG9nLnRyYW5zcG9ydHMuY29uc29sZSxcbiAgICAgICAgZWxlY3Ryb25Mb2cudHJhbnNwb3J0cy5pcGMsXG4gICAgICAgIGVsZWN0cm9uTG9nLnRyYW5zcG9ydHMuZmlsZSxcbiAgICAgIF07XG5cbiAgICAgIGxvZy5ydW5UcmFuc3BvcnRzKHRyYW5zcG9ydHMsIGVycm9yTWVzc2FnZSwgZWxlY3Ryb25Mb2cpO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBvc3Qoc2VydmVyVXJsLCByZXF1ZXN0T3B0aW9ucywgZGF0YSkge1xuICB2YXIgdXJsT2JqZWN0ID0gdXJsLnBhcnNlKHNlcnZlclVybCk7XG4gIHZhciBodHRwVHJhbnNwb3J0ID0gdXJsT2JqZWN0LnByb3RvY29sID09PSAnaHR0cHM6JyA/IGh0dHBzIDogaHR0cDtcblxuICB2YXIgYm9keSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuXG4gIHZhciBvcHRpb25zID0ge1xuICAgIGhvc3RuYW1lOiB1cmxPYmplY3QuaG9zdG5hbWUsXG4gICAgcG9ydDogICAgIHVybE9iamVjdC5wb3J0LFxuICAgIHBhdGg6ICAgICB1cmxPYmplY3QucGF0aCxcbiAgICBtZXRob2Q6ICAgJ1BPU1QnLFxuICAgIGhlYWRlcnM6ICB7XG4gICAgICAnQ29udGVudC1MZW5ndGgnOiBib2R5Lmxlbmd0aCxcbiAgICAgICdDb250ZW50LVR5cGUnOiAgICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICB9LFxuICB9O1xuXG4gIE9iamVjdC5hc3NpZ24ob3B0aW9ucywgcmVxdWVzdE9wdGlvbnMpO1xuXG4gIHZhciByZXF1ZXN0ID0gaHR0cFRyYW5zcG9ydC5yZXF1ZXN0KG9wdGlvbnMpO1xuICByZXF1ZXN0LndyaXRlKGJvZHkpO1xuICByZXF1ZXN0LmVuZCgpO1xuXG4gIHJldHVybiByZXF1ZXN0O1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5lbGVjdHJvbkV2ZW50ID0ge1xyXG4gICAgLyoqIOOCteODvOODkOODvOi1t+WLlSAqL1xyXG4gICAgJ3N0YXJ0LXNlcnZlcic6ICdzdGFydC1zZXJ2ZXInLFxyXG4gICAgLyoqIOOCteODvOODkOODvOWBnOatoiAqL1xyXG4gICAgJ3N0b3Atc2VydmVyJzogJ3N0b3Atc2VydmVyJyxcclxuICAgIC8qKiBDb25maWfpgannlKggKi9cclxuICAgICdhcHBseS1jb25maWcnOiAnYXBwbHktY29uZmlnJyxcclxuICAgIC8qKiDjgqLjg6njg7zjg4jooajnpLogKi9cclxuICAgICdzaG93LWFsZXJ0JzogJ3Nob3ctYWxlcnQnLFxyXG4gICAgLyoqIOajkuiqreOBv+WGjeeUnyAqL1xyXG4gICAgJ3BsYXktdGFtaXlhc3UnOiAncGxheS10YW1peWFzdScsXHJcbiAgICAvKiog44Os44K5552A5L+h6Z+z5YaN55SfICovXHJcbiAgICAncGxheS1zb3VuZC1zdGFydCc6ICdwbGF5LXNvdW5kLXN0YXJ0JyxcclxuICAgICdwbGF5LXNvdW5kLWVuZCc6ICdwbGF5LXNvdW5kLWVuZCcsXHJcbiAgICAnd2FpdC15b21pa28tdGltZSc6ICd3YWl0LXlvbWlrby10aW1lJyxcclxuICAgICdzcGVha2luZy1lbmQnOiAnc3BlYWtpbmctZW5kJyxcclxuICAgIC8qKiDjgrPjg6Hjg7Pjg4jooajnpLogKi9cclxuICAgICdzaG93LWNvbW1lbnQnOiAnc2hvdy1jb21tZW50JyxcclxuICAgIC8qKiDjgrPjg6Hjg7Pjg4jmrITliJ3mnJ/ljJYgKi9cclxuICAgICdjbGVhci1jb21tZW50JzogJ2NsZWFyLWNvbW1lbnQnLFxyXG4gICAgLyoqIOOCteODvOODkOODvOi1t+WLleOBrui/lOS/oSAqL1xyXG4gICAgJ3N0YXJ0LXNlcnZlci1yZXBseSc6ICdzdGFydC1zZXJ2ZXItcmVwbHknLFxyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgZWxlY3Ryb25fMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZWxlY3Ryb25cIikpO1xyXG52YXIgZWxlY3Ryb25fbG9nXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImVsZWN0cm9uLWxvZ1wiKSk7XHJcbnZhciBjb25zdF8xID0gcmVxdWlyZShcIi4uL21haW4vY29uc3RcIik7XHJcbnZhciBpcGNSZW5kZXJlciA9IGVsZWN0cm9uXzEuZGVmYXVsdC5pcGNSZW5kZXJlcjtcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnNvbGUuZGVidWcoJ1tyZW5kZXJlci5qc10gRE9NIENvbnRlbnQgTG9hZGVkJyk7XHJcbn0pO1xyXG4vLyDjgrPjg6Hjg7Pjg4jooajnpLpcclxuaXBjUmVuZGVyZXIub24oY29uc3RfMS5lbGVjdHJvbkV2ZW50WydzaG93LWNvbW1lbnQnXSwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7XHJcbiAgICBlbGVjdHJvbl9sb2dfMS5kZWZhdWx0LmluZm8oJ1tzaG93LWNvbW1lbnRdIHJlY2VpdmVkJyk7XHJcbiAgICB2YXIgZG9tID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlcy1saXN0Jyk7XHJcbiAgICAvLyDjgrnjgq/jg63jg7zjg6vkvY3nva7jgYznq6/jgafjgYLjgovjgarjgonjgIHjgrnjgq/jg63jg7zjg6vkvY3nva7jgoLov73lvpPjgZnjgotcclxuICAgIHZhciBpc1RvcCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgPT09IDA7XHJcbiAgICB2YXIgaXNCb3R0b20gPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCA9PT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbEhlaWdodDtcclxuICAgIC8vIOihqOekuumghuOCquODl+OCt+ODp+ODs+OBp+S4iuOBq+i/veWKoOOBmeOCi+OBi+S4i+OBq+i/veWKoOOBmeOCi+OBi+mBuOOBtlxyXG4gICAgaWYgKGFyZ3MuY29uZmlnLmRpc3BTb3J0KSB7XHJcbiAgICAgICAgLy8g5LiL44Gr6L+95YqgXHJcbiAgICAgICAgZG9tLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgYXJncy5kb20pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgLy8g5LiK44Gr6L+95YqgXHJcbiAgICAgICAgZG9tLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsIGFyZ3MuZG9tKTtcclxuICAgIH1cclxuICAgIGlmIChpc1RvcCkge1xyXG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUbygwLCAwKTtcclxuICAgIH1cclxuICAgIGlmIChpc0JvdHRvbSkge1xyXG4gICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUbygwLCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0KTtcclxuICAgIH1cclxufSk7XHJcbi8vIOODquOCu+ODg+ODiFxyXG5pcGNSZW5kZXJlci5vbihjb25zdF8xLmVsZWN0cm9uRXZlbnRbJ2NsZWFyLWNvbW1lbnQnXSwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBlbGVjdHJvbl9sb2dfMS5kZWZhdWx0LmluZm8oJ1tjbGVhci1jb21tZW50XSByZWNlaXZlZCcpO1xyXG4gICAgdmFyIGRvbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXMtbGlzdCcpO1xyXG4gICAgZG9tLmlubmVySFRNTCA9ICcnO1xyXG59KTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXZlbnRzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaHR0cHNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwib3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1cmxcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXRpbFwiKTsiXSwic291cmNlUm9vdCI6IiJ9