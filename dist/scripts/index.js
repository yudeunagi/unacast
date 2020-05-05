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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/renderer/renderer.ts");
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

/***/ "./src/renderer/renderer.ts":
/*!**********************************!*\
  !*** ./src/renderer/renderer.ts ***!
  \**********************************/
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
var electron_1 = __importDefault(__webpack_require__(/*! electron */ "electron"));
var electron_log_1 = __importDefault(__webpack_require__(/*! electron-log */ "./node_modules/electron-log/src/index.js"));
var const_1 = __webpack_require__(/*! ../main/const */ "./src/main/const.ts");
var ipcRenderer = electron_1.default.ipcRenderer;
document.addEventListener('DOMContentLoaded', function () {
    console.debug('[renderer.js]DOM Content Loaded');
    //設定のロード
    loadConfigToLocalStrage();
    //停止確認ダイアログ
    var dialog = document.getElementById('close-dialog');
    // ダイアログのボタン
    var closeOkButton = document.getElementById('button-close-dialog-ok');
    var closeCancelButton = document.getElementById('button-close-dialog-cancel');
    // 設定適用ボタン
    var applyButton = document.getElementById('button-config-apply');
    applyButton.onclick = function () {
        var config = buildConfigJson();
        console.log('[renderer.js]config=');
        console.log(config);
        //設定情報をローカルストレージへ保存
        saveConfigToLocalStrage(config);
        ipcRenderer.send(const_1.electronEvent['apply-config'], config);
    };
    // 起動・停止ボタン
    var startButton = document.getElementById('button-server-start');
    startButton.onclick = function () {
        toggleInputFormDisable(true);
        //設定情報取得
        var config = buildConfigJson();
        console.log('[renderer.js]config=');
        console.log(config);
        //設定情報をローカルストレージへ保存
        saveConfigToLocalStrage(config);
        // URLとポートを指定していない場合はエラー
        if (config.url === null || config.url.length < 1 || config.port === null || config.port.length < 1) {
            return;
        }
        // サーバー開始メッセージを送信する
        var result = ipcRenderer.sendSync('start-server', config);
        console.debug("[renderer.js] " + result);
        // サーバー起動・停止ボタン状態変更
        stopButton.disabled = false;
        startButton.disabled = true;
        return;
    };
    //サーバー停止ボタン
    var stopButton = document.getElementById('button-server-stop');
    stopButton.onclick = function () {
        //確認ダイアログを表示
        dialog.showModal();
    };
    // サーバー停止確認ダイアログ
    closeOkButton.onclick = function () {
        var result = ipcRenderer.sendSync('stop-server');
        console.debug('[renderer.js]' + result);
        //ダイアログクローズ
        dialog.close();
        toggleInputFormDisable(false);
        // サーバー起動・停止ボタン状態変更
        startButton.disabled = false;
        stopButton.disabled = true;
        return;
    };
    closeCancelButton.onclick = function () {
        //ダイアログクローズ
        dialog.close();
        return;
    };
});
/**
 * サーバ起動中にいじっちゃいけない設定の活性状態を切り替える
 * @param isDisabled 非活性ならtrue
 */
var toggleInputFormDisable = function (isDisabled) {
    document.getElementById('text-port-number').disabled = isDisabled;
    document.getElementById('text-youtube-id').disabled = isDisabled;
    document.getElementById('text-twitch-id').disabled = isDisabled;
    document.getElementsByName('dispSort').forEach(function (v, i) {
        v.disabled = isDisabled;
        v.parentNode.style.backgroundColor = isDisabled ? 'lightgray' : '';
    });
    document.getElementById('checkbox-wordBreak').disabled = isDisabled;
    document.getElementById('checkbox-wordBreak').parentNode.style.backgroundColor = isDisabled ? 'lightgray' : '';
};
/**
 * 設定RenderのHTMLから、Configを取得する
 */
var buildConfigJson = function () {
    //画面から各種項目を取得する
    var url = document.getElementById('text-url').value;
    var resNumber = document.getElementById('text-res-number').value;
    var initMessage = document.getElementById('text-init-message').value;
    var port = parseInt(document.getElementById('text-port-number').value);
    // const dispNumber = parseInt((document.getElementById('text-disp-number') as HTMLInputElement).value);
    var dispNumber = NaN;
    var interval = parseInt(document.getElementById('rangeSpan').value);
    var youtubeUrl = document.getElementById('text-youtube-id').value;
    var twitchUrl = document.getElementById('text-twitch-id').value;
    var sePath = document.getElementById('text-se-path').value;
    var tamiyasuPath = document.getElementById('text-tamiyasu-path').value;
    var bouyomiPort = parseInt(document.getElementById('text-bouyomi-port').value);
    var bouyomiVolume = parseInt(document.getElementById('bouyomi-volume').value);
    var notifyThreadConnectionErrorLimit = parseInt(document.getElementById('text-notify-threadConnectionErrorLimit').value);
    var notifyThreadResLimit = parseInt(document.getElementById('text-notify-threadResLimit').value);
    //レス番表示設定
    var showNumber = document.getElementById('checkbox-showNumber').checked === true;
    //名前表示設定
    var showName = document.getElementById('checkbox-showName').checked === true;
    //時刻表示設定
    var showTime = document.getElementById('checkbox-showTime').checked === true;
    //自動改行設定
    var wordBreak = document.getElementById('checkbox-wordBreak').checked === true;
    //表示順序設定
    var dispSort = document.getElementById('newResUp').checked === false;
    //本文改行設定
    var newLine = document.getElementById('enableNewLine').checked === true;
    //本文改行設定
    var playSe = document.getElementById('checkbox-playSe').checked === true;
    var typeYomiko = 'none';
    document.getElementsByName('typeYomiko').forEach(function (v) {
        var elem = v;
        if (elem.checked)
            typeYomiko = elem.value;
    });
    // コメント処理
    var commentProcessType = 0;
    document.getElementsByName('commentProcessType').forEach(function (v) {
        var elem = v;
        if (elem.checked)
            commentProcessType = Number(elem.value);
    });
    var config = {
        url: url,
        resNumber: resNumber,
        initMessage: initMessage,
        port: port,
        dispNumber: dispNumber,
        interval: interval,
        youtubeId: youtubeUrl,
        twitchId: twitchUrl,
        dispSort: dispSort,
        newLine: newLine,
        showNumber: showNumber,
        showName: showName,
        showTime: showTime,
        wordBreak: wordBreak,
        sePath: sePath,
        playSe: playSe,
        typeYomiko: typeYomiko,
        tamiyasuPath: tamiyasuPath,
        bouyomiPort: bouyomiPort,
        bouyomiVolume: bouyomiVolume,
        notifyThreadConnectionErrorLimit: notifyThreadConnectionErrorLimit,
        notifyThreadResLimit: notifyThreadResLimit,
        commentProcessType: commentProcessType,
    };
    return config;
};
/**
 * 設定をローカルストレージへ保存する
 * サーバー起動時に呼び出される
 */
var saveConfigToLocalStrage = function (config) {
    localStorage.setItem('config', JSON.stringify(config));
    console.debug('[renderer.js]config saved');
};
/**
 * ローカルストレージから設定をロードする
 */
var loadConfigToLocalStrage = function () {
    var initConfig = {
        url: '',
        resNumber: '',
        initMessage: 'スレッド読み込みを開始しました',
        port: 3000,
        interval: 10,
        dispNumber: NaN,
        youtubeId: '',
        twitchId: '',
        dispSort: false,
        newLine: true,
        showNumber: true,
        showName: false,
        showTime: false,
        wordBreak: true,
        sePath: '',
        playSe: false,
        typeYomiko: 'none',
        tamiyasuPath: '',
        bouyomiPort: 50001,
        bouyomiVolume: 50,
        notifyThreadConnectionErrorLimit: 0,
        notifyThreadResLimit: 0,
        commentProcessType: 0,
    };
    var storageStr = localStorage.getItem('config');
    var storageJson = storageStr ? JSON.parse(storageStr) : {};
    globalThis.config = __assign(__assign({}, initConfig), storageJson);
    // 表示に反映する
    // レス番表示初期化
    document.getElementById('checkbox-showNumber').checked = config.showNumber;
    // 名前表示初期化
    document.getElementById('checkbox-showName').checked = config.showName;
    // 時刻表示初期化
    document.getElementById('checkbox-showTime').checked = config.showTime;
    // 自動改行初期化
    document.getElementById('checkbox-wordBreak').checked = config.wordBreak;
    // レス表示順ラジオ初期化
    if (config.dispSort) {
        document.getElementById('newResDown').checked = true;
    }
    else {
        document.getElementById('newResUp').checked = true;
    }
    // 改行設定初期化
    if (config.newLine) {
        document.getElementById('enableNewLine').checked = true;
    }
    else {
        document.getElementById('disableNewLine').checked = true;
    }
    document.getElementById('text-port-number').value = config.port;
    document.getElementById('spanDisp').innerHTML = config.interval;
    document.getElementById('rangeSpan').value = config.interval;
    document.getElementById('text-init-message').value = config.initMessage;
    document.getElementById('text-url').value = config.url;
    document.getElementById('text-res-number').value = config.resNumber.toString();
    document.getElementById('text-youtube-id').value = config.youtubeId;
    document.getElementById('text-twitch-id').value = config.twitchId;
    document.getElementById('text-se-path').value = config.sePath;
    document.getElementById('checkbox-playSe').checked = config.playSe;
    // 読み子の種類
    switch (config.typeYomiko) {
        case 'none':
            document.getElementById('yomiko_none').checked = true;
            break;
        case 'tamiyasu':
            document.getElementById('yomiko_tamiyasu').checked = true;
            break;
        case 'bouyomi':
            document.getElementById('yomiko_bouyomi').checked = true;
            break;
    }
    switch (config.commentProcessType) {
        case 0:
        case 1:
            document.getElementById("commentProcessType_" + config.commentProcessType).checked = true;
            break;
    }
    document.getElementById('text-tamiyasu-path').value = config.tamiyasuPath;
    document.getElementById('text-bouyomi-port').value = config.bouyomiPort;
    document.getElementById('disp-bouyomi-volume').innerHTML = config.bouyomiVolume;
    document.getElementById('bouyomi-volume').value = config.bouyomiVolume;
    document.getElementById('text-notify-threadConnectionErrorLimit').value = config.notifyThreadConnectionErrorLimit;
    document.getElementById('text-notify-threadResLimit').value = config.notifyThreadResLimit;
    console.debug('[renderer.js]config loaded');
};
// サーバー起動返信
ipcRenderer.on(const_1.electronEvent['start-server-reply'], function (event, arg) {
    console.debug(arg);
});
// 着信音再生
var audioElem = new Audio();
ipcRenderer.on(const_1.electronEvent['play-sound-start'], function (event, wavfilepath) {
    try {
        audioElem.src = wavfilepath;
        audioElem.play();
        audioElem.onended = function () {
            ipcRenderer.send(const_1.electronEvent['play-sound-end']);
        };
        audioElem.onerror = function () {
            ipcRenderer.send(const_1.electronEvent['play-sound-end']);
        };
    }
    catch (e) {
        electron_log_1.default.error(e);
        ipcRenderer.send(const_1.electronEvent['play-sound-end']);
    }
});
ipcRenderer.on(const_1.electronEvent['wait-yomiko-time'], function (event, arg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, yomikoTime(arg)];
            case 1:
                _a.sent();
                ipcRenderer.send(const_1.electronEvent['speaking-end']);
                return [2 /*return*/];
        }
    });
}); });
/** 音声合成が終わってそうな頃にreturn返す */
var yomikoTime = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve) {
                var uttr = new globalThis.SpeechSynthesisUtterance(msg);
                uttr.volume = 0;
                uttr.onend = function (event) {
                    resolve();
                };
                speechSynthesis.speak(uttr);
            })];
    });
}); };
// 何かしら通知したいことがあったら表示する
ipcRenderer.on(const_1.electronEvent['show-alert'], function (event, args) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        alert(args);
        return [2 /*return*/];
    });
}); });


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvZy9zcmMvY2F0Y2hFcnJvcnMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvZy9zcmMvZWxlY3Ryb25BcGkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvZy9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvZy9zcmMvbG9nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2cvc3JjL3Njb3BlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2cvc3JjL3RyYW5zZm9ybS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tbG9nL3NyYy90cmFuc2Zvcm0vb2JqZWN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2cvc3JjL3RyYW5zZm9ybS9zdHlsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tbG9nL3NyYy90cmFuc2Zvcm0vdGVtcGxhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvZy9zcmMvdHJhbnNwb3J0cy9jb25zb2xlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2cvc3JjL3RyYW5zcG9ydHMvZmlsZS9maWxlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9lbGVjdHJvbi1sb2cvc3JjL3RyYW5zcG9ydHMvZmlsZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tbG9nL3NyYy90cmFuc3BvcnRzL2ZpbGUvcGFja2FnZUpzb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLWxvZy9zcmMvdHJhbnNwb3J0cy9maWxlL3ZhcmlhYmxlcy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tbG9nL3NyYy90cmFuc3BvcnRzL2lwYy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24tbG9nL3NyYy90cmFuc3BvcnRzL3JlbW90ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9jb25zdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVuZGVyZXIvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZWxlY3Ryb25cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJldmVudHNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJmc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImh0dHBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJodHRwc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcIm9zXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInVybFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInV0aWxcIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOzs7Ozs7Ozs7Ozs7O0FDaEphOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNENBQTRDLFlBQVk7QUFDeEQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7Ozs7Ozs7O0FDMUVhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsSUFBSTtBQUNmLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsRUFBRTtBQUNqQixlQUFlLEVBQUU7QUFDakIsZUFBZSxFQUFFO0FBQ2pCLGVBQWUsRUFBRTtBQUNqQixlQUFlLEVBQUU7QUFDakIsZUFBZSxFQUFFO0FBQ2pCLGVBQWUsR0FBRztBQUNsQixlQUFlLEVBQUU7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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsaUZBQWlGO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxFQUFFLEVBQUU7QUFDTDtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLEtBQUs7QUFDTCxDQUFDLEVBQUU7QUFDSDtBQUNBLDRFQUE0RTtBQUM1RTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQ0FBQyxFQUFFLEVBQUU7Ozs7Ozs7Ozs7OztBQ3pXTCxxQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxrQzs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxnQzs7Ozs7Ozs7Ozs7QUNBQSxpQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3JlbmRlcmVyL3JlbmRlcmVyLnRzXCIpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFNvbWUgaWRlYXMgZnJvbSBzaW5kcmVzb3JodXMvZWxlY3Ryb24tdW5oYW5kbGVkXG4gKi9cblxudmFyIGVsZWN0cm9uQXBpID0gcmVxdWlyZSgnLi9lbGVjdHJvbkFwaScpO1xuXG52YXIgaXNBdHRhY2hlZCA9IGZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNhdGNoRXJyb3JzKG9wdGlvbnMpIHtcbiAgaWYgKGlzQXR0YWNoZWQpIHJldHVybiB7IHN0b3A6IHN0b3AgfTtcbiAgaXNBdHRhY2hlZCA9IHRydWU7XG5cbiAgaWYgKHByb2Nlc3MudHlwZSA9PT0gJ3JlbmRlcmVyJykge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIG9uUmVuZGVyZXJFcnJvcik7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3VuaGFuZGxlZHJlamVjdGlvbicsIG9uUmVuZGVyZXJSZWplY3Rpb24pO1xuICB9IGVsc2Uge1xuICAgIHByb2Nlc3Mub24oJ3VuY2F1Z2h0RXhjZXB0aW9uJywgb25FcnJvcik7XG4gICAgcHJvY2Vzcy5vbigndW5oYW5kbGVkUmVqZWN0aW9uJywgb25SZWplY3Rpb24pO1xuICB9XG5cbiAgcmV0dXJuIHsgc3RvcDogc3RvcCB9O1xuXG4gIGZ1bmN0aW9uIG9uRXJyb3IoZSkge1xuICAgIHRyeSB7XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMub25FcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBpZiAob3B0aW9ucy5vbkVycm9yKGUpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBvcHRpb25zLmxvZyhlKTtcblxuICAgICAgaWYgKG9wdGlvbnMuc2hvd0RpYWxvZyAmJiBlLm5hbWUuaW5kZXhPZignVW5oYW5kbGVkUmVqZWN0aW9uJykgPCAwKSB7XG4gICAgICAgIHZhciB0eXBlID0gcHJvY2Vzcy50eXBlIHx8ICdtYWluJztcbiAgICAgICAgZWxlY3Ryb25BcGkuc2hvd0Vycm9yQm94KFxuICAgICAgICAgICdBIEphdmFTY3JpcHQgZXJyb3Igb2NjdXJyZWQgaW4gdGhlICcgKyB0eXBlICsgJyBwcm9jZXNzJyxcbiAgICAgICAgICBlLnN0YWNrXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAobG9nRXJyb3IpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uUmVqZWN0aW9uKHJlYXNvbikge1xuICAgIGlmIChyZWFzb24gaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgdmFyIHJlYXNvbk5hbWUgPSAnVW5oYW5kbGVkUmVqZWN0aW9uICcgKyByZWFzb24ubmFtZTtcblxuICAgICAgdmFyIGVyclByb3RvdHlwZSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihyZWFzb24pO1xuICAgICAgdmFyIG5hbWVQcm9wZXJ0eSA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZXJyUHJvdG90eXBlLCAnbmFtZScpO1xuICAgICAgaWYgKCFuYW1lUHJvcGVydHkgfHwgIW5hbWVQcm9wZXJ0eS53cml0YWJsZSkge1xuICAgICAgICByZWFzb24gPSBuZXcgRXJyb3IocmVhc29uLm1lc3NhZ2UpO1xuICAgICAgfVxuXG4gICAgICByZWFzb24ubmFtZSA9IHJlYXNvbk5hbWU7XG4gICAgICBvbkVycm9yKHJlYXNvbik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGVycm9yID0gbmV3IEVycm9yKEpTT04uc3RyaW5naWZ5KHJlYXNvbikpO1xuICAgIGVycm9yLm5hbWUgPSAnVW5oYW5kbGVkUmVqZWN0aW9uJztcbiAgICBvbkVycm9yKGVycm9yKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uUmVuZGVyZXJFcnJvcihldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgb25FcnJvcihldmVudC5lcnJvcik7XG4gIH1cblxuICBmdW5jdGlvbiBvblJlbmRlcmVyUmVqZWN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBvblJlamVjdGlvbihldmVudC5yZWFzb24pO1xuICB9XG5cbiAgZnVuY3Rpb24gc3RvcCgpIHtcbiAgICBpc0F0dGFjaGVkID0gZmFsc2U7XG5cbiAgICBpZiAocHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCBvblJlbmRlcmVyRXJyb3IpO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3VuaGFuZGxlZHJlamVjdGlvbicsIG9uUmVuZGVyZXJSZWplY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9jZXNzLnJlbW92ZUxpc3RlbmVyKCd1bmNhdWdodEV4Y2VwdGlvbicsIG9uRXJyb3IpO1xuICAgICAgcHJvY2Vzcy5yZW1vdmVMaXN0ZW5lcigndW5oYW5kbGVkUmVqZWN0aW9uJywgb25SZWplY3Rpb24pO1xuICAgIH1cbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTcGxpdCBFbGVjdHJvbiBBUEkgZnJvbSB0aGUgbWFpbiBjb2RlXG4gKi9cblxudmFyIGVsZWN0cm9uO1xudHJ5IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGdsb2JhbC1yZXF1aXJlXG4gIGVsZWN0cm9uID0gcmVxdWlyZSgnZWxlY3Ryb24nKTtcbn0gY2F0Y2ggKGUpIHtcbiAgZWxlY3Ryb24gPSBudWxsO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0TmFtZTogZ2V0TmFtZSxcbiAgZ2V0UGF0aDogZ2V0UGF0aCxcbiAgZ2V0VmVyc2lvbjogZ2V0VmVyc2lvbixcbiAgaXNEZXY6IGlzRGV2LFxuICBpc0VsZWN0cm9uOiBpc0VsZWN0cm9uLFxuICBpc0lwY0NoYW5uZWxMaXN0ZW5lZDogaXNJcGNDaGFubmVsTGlzdGVuZWQsXG4gIGxvYWRSZW1vdGVNb2R1bGU6IGxvYWRSZW1vdGVNb2R1bGUsXG4gIG9uSXBjOiBvbklwYyxcbiAgc2VuZElwYzogc2VuZElwYyxcbiAgc2hvd0Vycm9yQm94OiBzaG93RXJyb3JCb3gsXG59O1xuXG5mdW5jdGlvbiBnZXRBcHAoKSB7XG4gIHJldHVybiBnZXRFbGVjdHJvbk1vZHVsZSgnYXBwJyk7XG59XG5cbmZ1bmN0aW9uIGdldE5hbWUoKSB7XG4gIHZhciBhcHAgPSBnZXRBcHAoKTtcbiAgaWYgKCFhcHApIHJldHVybiBudWxsO1xuXG4gIHJldHVybiAnbmFtZScgaW4gYXBwID8gYXBwLm5hbWUgOiBhcHAuZ2V0TmFtZSgpO1xufVxuXG5mdW5jdGlvbiBnZXRFbGVjdHJvbk1vZHVsZShuYW1lKSB7XG4gIGlmICghZWxlY3Ryb24pIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChlbGVjdHJvbltuYW1lXSkge1xuICAgIHJldHVybiBlbGVjdHJvbltuYW1lXTtcbiAgfVxuXG4gIGlmIChlbGVjdHJvbi5yZW1vdGUpIHtcbiAgICByZXR1cm4gZWxlY3Ryb24ucmVtb3RlW25hbWVdO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldElwYygpIHtcbiAgaWYgKHByb2Nlc3MudHlwZSA9PT0gJ2Jyb3dzZXInICYmIGVsZWN0cm9uICYmIGVsZWN0cm9uLmlwY01haW4pIHtcbiAgICByZXR1cm4gZWxlY3Ryb24uaXBjTWFpbjtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicgJiYgZWxlY3Ryb24gJiYgZWxlY3Ryb24uaXBjUmVuZGVyZXIpIHtcbiAgICByZXR1cm4gZWxlY3Ryb24uaXBjUmVuZGVyZXI7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuXG5mdW5jdGlvbiBnZXRQYXRoKG5hbWUpIHtcbiAgdmFyIGFwcCA9IGdldEFwcCgpO1xuICBpZiAoIWFwcCkgcmV0dXJuIG51bGw7XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gYXBwLmdldFBhdGgobmFtZSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRSZW1vdGUoKSB7XG4gIGlmIChlbGVjdHJvbiAmJiBlbGVjdHJvbi5yZW1vdGUpIHtcbiAgICByZXR1cm4gZWxlY3Ryb24ucmVtb3RlO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldFZlcnNpb24oKSB7XG4gIHZhciBhcHAgPSBnZXRBcHAoKTtcbiAgaWYgKCFhcHApIHJldHVybiBudWxsO1xuXG4gIHJldHVybiAndmVyc2lvbicgaW4gYXBwID8gYXBwLnZlcnNpb24gOiBhcHAuZ2V0VmVyc2lvbigpO1xufVxuXG5mdW5jdGlvbiBpc0RldigpIHtcbiAgLy8gYmFzZWQgb24gc2luZHJlc29yaHVzL2VsZWN0cm9uLWlzLWRldlxuICB2YXIgYXBwID0gZ2V0QXBwKCk7XG4gIGlmICghYXBwKSByZXR1cm4gZmFsc2U7XG5cbiAgcmV0dXJuICFhcHAuaXNQYWNrYWdlZCB8fCBwcm9jZXNzLmVudi5FTEVDVFJPTl9JU19ERVYgPT09ICcxJztcbn1cblxuZnVuY3Rpb24gaXNFbGVjdHJvbigpIHtcbiAgcmV0dXJuIHByb2Nlc3MudHlwZSA9PT0gJ2Jyb3dzZXInIHx8IHByb2Nlc3MudHlwZSA9PT0gJ3JlbmRlcmVyJztcbn1cblxuLyoqXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgcHJvY2VzcyBsaXN0ZW5zIGZvciB0aGUgSVBDIGNoYW5uZWxcbiAqIEBwYXJhbSB7c3RyaW5nfSBjaGFubmVsXG4gKi9cbmZ1bmN0aW9uIGlzSXBjQ2hhbm5lbExpc3RlbmVkKGNoYW5uZWwpIHtcbiAgdmFyIGlwYyA9IGdldElwYygpO1xuICByZXR1cm4gaXBjID8gaXBjLmxpc3RlbmVyQ291bnQoY2hhbm5lbCkgPiAwIDogZmFsc2U7XG59XG5cbi8qKlxuICogVHJ5IHRvIGxvYWQgdGhlIG1vZHVsZSBpbiB0aGUgb3Bwb3NpdGUgcHJvY2Vzc1xuICogQHBhcmFtIHtzdHJpbmd9IG1vZHVsZU5hbWVcbiAqL1xuZnVuY3Rpb24gbG9hZFJlbW90ZU1vZHVsZShtb2R1bGVOYW1lKSB7XG4gIGlmIChwcm9jZXNzLnR5cGUgPT09ICdicm93c2VyJykge1xuICAgIGdldEFwcCgpLm9uKCd3ZWItY29udGVudHMtY3JlYXRlZCcsIGZ1bmN0aW9uIChlLCBjb250ZW50cykge1xuICAgICAgdmFyIHByb21pc2UgPSBjb250ZW50cy5leGVjdXRlSmF2YVNjcmlwdChcbiAgICAgICAgJ3RyeSB7cmVxdWlyZShcIicgKyBtb2R1bGVOYW1lICsgJ1wiKX0gY2F0Y2goZSl7fTsgdm9pZCAwOydcbiAgICAgICk7XG5cbiAgICAgIC8vIERvIG5vdGhpbmcgb24gZXJyb3IsIGp1c3QgcHJldmVudCBVbmhhbmRsZWQgcmVqZWN0aW9uXG4gICAgICBpZiAocHJvbWlzZSAmJiB0eXBlb2YgcHJvbWlzZS5jYXRjaCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwcm9taXNlLmNhdGNoKGZ1bmN0aW9uICgpIHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmIChwcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicpIHtcbiAgICB0cnkge1xuICAgICAgZ2V0UmVtb3RlKCkucmVxdWlyZShtb2R1bGVOYW1lKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAvLyBDYW4ndCBiZSByZXF1aXJlZC4gV2VicGFjaz9cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBMaXN0ZW4gdG8gYXN5bmMgbWVzc2FnZXMgc2VudCBmcm9tIG9wcG9zaXRlIHByb2Nlc3NcbiAqIEBwYXJhbSB7c3RyaW5nfSBjaGFubmVsXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lclxuICovXG5mdW5jdGlvbiBvbklwYyhjaGFubmVsLCBsaXN0ZW5lcikge1xuICB2YXIgaXBjID0gZ2V0SXBjKCk7XG4gIGlmIChpcGMpIHtcbiAgICBpcGMub24oY2hhbm5lbCwgbGlzdGVuZXIpO1xuICB9XG59XG5cbi8qKlxuICogU2VudCBhIG1lc3NhZ2UgdG8gb3Bwb3NpdGUgcHJvY2Vzc1xuICogQHBhcmFtIHtzdHJpbmd9IGNoYW5uZWxcbiAqIEBwYXJhbSB7YW55fSBtZXNzYWdlXG4gKi9cbmZ1bmN0aW9uIHNlbmRJcGMoY2hhbm5lbCwgbWVzc2FnZSkge1xuICBpZiAocHJvY2Vzcy50eXBlID09PSAnYnJvd3NlcicpIHtcbiAgICBzZW5kSXBjVG9SZW5kZXJlcihjaGFubmVsLCBtZXNzYWdlKTtcbiAgfSBlbHNlIGlmIChwcm9jZXNzLnR5cGUgPT09ICdyZW5kZXJlcicpIHtcbiAgICBzZW5kSXBjVG9NYWluKGNoYW5uZWwsIG1lc3NhZ2UpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNlbmRJcGNUb01haW4oY2hhbm5lbCwgbWVzc2FnZSkge1xuICB2YXIgaXBjID0gZ2V0SXBjKCk7XG4gIGlmIChpcGMpIHtcbiAgICBpcGMuc2VuZChjaGFubmVsLCBtZXNzYWdlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZW5kSXBjVG9SZW5kZXJlcihjaGFubmVsLCBtZXNzYWdlKSB7XG4gIGlmICghZWxlY3Ryb24gfHwgIWVsZWN0cm9uLkJyb3dzZXJXaW5kb3cpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBlbGVjdHJvbi5Ccm93c2VyV2luZG93LmdldEFsbFdpbmRvd3MoKS5mb3JFYWNoKGZ1bmN0aW9uICh3bmQpIHtcbiAgICB3bmQud2ViQ29udGVudHMgJiYgd25kLndlYkNvbnRlbnRzLnNlbmQoY2hhbm5lbCwgbWVzc2FnZSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzaG93RXJyb3JCb3godGl0bGUsIG1lc3NhZ2UpIHtcbiAgdmFyIGRpYWxvZyA9IGdldEVsZWN0cm9uTW9kdWxlKCdkaWFsb2cnKTtcbiAgaWYgKCFkaWFsb2cpIHJldHVybjtcblxuICBkaWFsb2cuc2hvd0Vycm9yQm94KHRpdGxlLCBtZXNzYWdlKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhdGNoRXJyb3JzID0gcmVxdWlyZSgnLi9jYXRjaEVycm9ycycpO1xudmFyIGVsZWN0cm9uQXBpID0gcmVxdWlyZSgnLi9lbGVjdHJvbkFwaScpO1xudmFyIGxvZyA9IHJlcXVpcmUoJy4vbG9nJykubG9nO1xudmFyIHNjb3BlRmFjdG9yeSA9IHJlcXVpcmUoJy4vc2NvcGUnKTtcbnZhciB0cmFuc3BvcnRDb25zb2xlID0gcmVxdWlyZSgnLi90cmFuc3BvcnRzL2NvbnNvbGUnKTtcbnZhciB0cmFuc3BvcnRGaWxlID0gcmVxdWlyZSgnLi90cmFuc3BvcnRzL2ZpbGUnKTtcbnZhciB0cmFuc3BvcnRJcGMgPSByZXF1aXJlKCcuL3RyYW5zcG9ydHMvaXBjJyk7XG52YXIgdHJhbnNwb3J0UmVtb3RlID0gcmVxdWlyZSgnLi90cmFuc3BvcnRzL3JlbW90ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZSgnZGVmYXVsdCcpO1xubW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IG1vZHVsZS5leHBvcnRzO1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2dJZFxuICogQHJldHVybiB7RWxlY3Ryb25Mb2cuRWxlY3Ryb25Mb2d9XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZShsb2dJZCkge1xuICAvKipcbiAgICogQHR5cGUge0VsZWN0cm9uTG9nLkVsZWN0cm9uTG9nfVxuICAgKi9cbiAgdmFyIGluc3RhbmNlID0ge1xuICAgIGNhdGNoRXJyb3JzOiBmdW5jdGlvbiBjYWxsQ2F0Y2hFcnJvcnMob3B0aW9ucykge1xuICAgICAgdmFyIG9wdHMgPSBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICAgIGxvZzogaW5zdGFuY2UuZXJyb3IsXG4gICAgICAgIHNob3dEaWFsb2c6IHByb2Nlc3MudHlwZSA9PT0gJ2Jyb3dzZXInLFxuICAgICAgfSwgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICAgIGNhdGNoRXJyb3JzKG9wdHMpO1xuICAgIH0sXG4gICAgY3JlYXRlOiBjcmVhdGUsXG4gICAgZnVuY3Rpb25zOiB7fSxcbiAgICBob29rczogW10sXG4gICAgaXNEZXY6IGVsZWN0cm9uQXBpLmlzRGV2KCksXG4gICAgbGV2ZWxzOiBbJ2Vycm9yJywgJ3dhcm4nLCAnaW5mbycsICd2ZXJib3NlJywgJ2RlYnVnJywgJ3NpbGx5J10sXG4gICAgbG9nSWQ6IGxvZ0lkLFxuICAgIHZhcmlhYmxlczoge1xuICAgICAgcHJvY2Vzc1R5cGU6IHByb2Nlc3MudHlwZSxcbiAgICB9LFxuICB9O1xuXG4gIGluc3RhbmNlLnNjb3BlID0gc2NvcGVGYWN0b3J5KGluc3RhbmNlKTtcblxuICBpbnN0YW5jZS50cmFuc3BvcnRzID0ge1xuICAgIGNvbnNvbGU6IHRyYW5zcG9ydENvbnNvbGUoaW5zdGFuY2UpLFxuICAgIGZpbGU6IHRyYW5zcG9ydEZpbGUoaW5zdGFuY2UpLFxuICAgIHJlbW90ZTogdHJhbnNwb3J0UmVtb3RlKGluc3RhbmNlKSxcbiAgICBpcGM6IHRyYW5zcG9ydElwYyhpbnN0YW5jZSksXG4gIH07XG5cbiAgaW5zdGFuY2UubGV2ZWxzLmZvckVhY2goZnVuY3Rpb24gKGxldmVsKSB7XG4gICAgaW5zdGFuY2VbbGV2ZWxdID0gbG9nLmJpbmQobnVsbCwgaW5zdGFuY2UsIHsgbGV2ZWw6IGxldmVsIH0pO1xuICAgIGluc3RhbmNlLmZ1bmN0aW9uc1tsZXZlbF0gPSBpbnN0YW5jZVtsZXZlbF07XG4gIH0pO1xuXG4gIGluc3RhbmNlLmxvZyA9IGxvZy5iaW5kKG51bGwsIGluc3RhbmNlLCB7IGxldmVsOiAnaW5mbycgfSk7XG4gIGluc3RhbmNlLmZ1bmN0aW9ucy5sb2cgPSBpbnN0YW5jZS5sb2c7XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29tcGFyZUxldmVsczogY29tcGFyZUxldmVscyxcbiAgbG9nOiBsb2csXG4gIHJ1blRyYW5zcG9ydDogcnVuVHJhbnNwb3J0LFxuICBydW5UcmFuc3BvcnRzOiBydW5UcmFuc3BvcnRzLFxufTtcblxuZnVuY3Rpb24gbG9nKGVsZWN0cm9uTG9nLCBvcHRpb25zKSB7XG4gIHZhciB0cmFuc3BvcnRzID0gZWxlY3Ryb25Mb2cudHJhbnNwb3J0cztcblxuICB2YXIgbWVzc2FnZSA9IHtcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpLFxuICAgIGRhdGU6IG5ldyBEYXRlKCksXG4gICAgbGV2ZWw6IG9wdGlvbnMubGV2ZWwsXG4gICAgc2NvcGU6IG9wdGlvbnMuc2NvcGUgPyBvcHRpb25zLnNjb3BlLnRvSlNPTigpIDogbnVsbCxcbiAgICB2YXJpYWJsZXM6IGVsZWN0cm9uTG9nLnZhcmlhYmxlcyxcbiAgfTtcblxuICBydW5UcmFuc3BvcnRzKHRyYW5zcG9ydHMsIG1lc3NhZ2UsIGVsZWN0cm9uTG9nKTtcbn1cblxuZnVuY3Rpb24gcnVuVHJhbnNwb3J0cyh0cmFuc3BvcnRzLCBtZXNzYWdlLCBlbGVjdHJvbkxvZykge1xuICBmb3IgKHZhciBpIGluIHRyYW5zcG9ydHMpIHtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRyYW5zcG9ydHMsIGkpKSB7XG4gICAgICBydW5UcmFuc3BvcnQodHJhbnNwb3J0c1tpXSwgbWVzc2FnZSwgZWxlY3Ryb25Mb2cpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBydW5UcmFuc3BvcnQodHJhbnNwb3J0LCBtZXNzYWdlLCBlbGVjdHJvbkxvZykge1xuICBpZiAodHlwZW9mIHRyYW5zcG9ydCAhPT0gJ2Z1bmN0aW9uJyB8fCB0cmFuc3BvcnQubGV2ZWwgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKCFjb21wYXJlTGV2ZWxzKGVsZWN0cm9uTG9nLmxldmVscywgdHJhbnNwb3J0LmxldmVsLCBtZXNzYWdlLmxldmVsKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG1lc3NhZ2UgPSBydW5Ib29rcyhlbGVjdHJvbkxvZy5ob29rcywgdHJhbnNwb3J0LCBtZXNzYWdlKTtcblxuICBpZiAobWVzc2FnZSkge1xuICAgIHRyYW5zcG9ydChtZXNzYWdlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb21wYXJlTGV2ZWxzKGxldmVscywgcGFzc0xldmVsLCBjaGVja0xldmVsKSB7XG4gIHZhciBwYXNzID0gbGV2ZWxzLmluZGV4T2YocGFzc0xldmVsKTtcbiAgdmFyIGNoZWNrID0gbGV2ZWxzLmluZGV4T2YoY2hlY2tMZXZlbCk7XG4gIGlmIChjaGVjayA9PT0gLTEgfHwgcGFzcyA9PT0gLTEpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBjaGVjayA8PSBwYXNzO1xufVxuXG5mdW5jdGlvbiBydW5Ib29rcyhob29rcywgdHJhbnNwb3J0LCBtZXNzYWdlKSB7XG4gIGlmICghaG9va3MgfHwgIWhvb2tzLmxlbmd0aCkge1xuICAgIHJldHVybiBtZXNzYWdlO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBsdXNwbHVzXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgaG9va3MubGVuZ3RoOyBpKyspIHtcbiAgICBtZXNzYWdlID0gaG9va3NbaV0obWVzc2FnZSwgdHJhbnNwb3J0KTtcbiAgICBpZiAoIW1lc3NhZ2UpIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIG1lc3NhZ2U7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBsb2cgPSByZXF1aXJlKCcuL2xvZycpLmxvZztcblxubW9kdWxlLmV4cG9ydHMgPSBzY29wZUZhY3Rvcnk7XG5cbi8qKlxuICogQHBhcmFtIHtFbGVjdHJvbkxvZy5FbGVjdHJvbkxvZ30gZWxlY3Ryb25Mb2dcbiAqIEByZXR1cm4ge0VsZWN0cm9uTG9nLlNjb3BlfVxuICovXG5mdW5jdGlvbiBzY29wZUZhY3RvcnkoZWxlY3Ryb25Mb2cpIHtcbiAgc2NvcGUubGFiZWxQYWRkaW5nID0gdHJ1ZTtcbiAgc2NvcGUuZGVmYXVsdExhYmVsID0gJyc7XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHNjb3BlLm1heExhYmVsTGVuZ3RoID0gMDtcblxuICAvKipcbiAgICogQHR5cGUge3R5cGVvZiBnZXRPcHRpb25zfVxuICAgKiBAcGFja2FnZVxuICAgKi9cbiAgc2NvcGUuZ2V0T3B0aW9ucyA9IGdldE9wdGlvbnM7XG5cbiAgcmV0dXJuIHNjb3BlO1xuXG4gIGZ1bmN0aW9uIHNjb3BlKGxhYmVsKSB7XG4gICAgdmFyIGluc3RhbmNlID0ge1xuICAgICAgbGFiZWw6IGxhYmVsLFxuICAgICAgdG9KU09OOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGFiZWw6IHRoaXMubGFiZWwsXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgIH07XG5cbiAgICBlbGVjdHJvbkxvZy5sZXZlbHMuZm9yRWFjaChmdW5jdGlvbiAobGV2ZWwpIHtcbiAgICAgIGluc3RhbmNlW2xldmVsXSA9IGxvZy5iaW5kKG51bGwsIGVsZWN0cm9uTG9nLCB7XG4gICAgICAgIGxldmVsOiBsZXZlbCxcbiAgICAgICAgc2NvcGU6IGluc3RhbmNlLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpbnN0YW5jZS5sb2cgPSBpbnN0YW5jZS5pbmZvO1xuXG4gICAgc2NvcGUubWF4TGFiZWxMZW5ndGggPSBNYXRoLm1heChzY29wZS5tYXhMYWJlbExlbmd0aCwgbGFiZWwubGVuZ3RoKTtcblxuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRlZmF1bHRMYWJlbDogc2NvcGUuZGVmYXVsdExhYmVsLFxuICAgICAgbGFiZWxMZW5ndGg6IGdldExhYmVsTGVuZ3RoKCksXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExhYmVsTGVuZ3RoKCkge1xuICAgIGlmIChzY29wZS5sYWJlbFBhZGRpbmcgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBzY29wZS5tYXhMYWJlbExlbmd0aDtcbiAgICB9XG5cbiAgICBpZiAoc2NvcGUubGFiZWxQYWRkaW5nID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBzY29wZS5sYWJlbFBhZGRpbmcgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gc2NvcGUubGFiZWxQYWRkaW5nO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBvYmplY3QgPSByZXF1aXJlKCcuL29iamVjdCcpO1xudmFyIHN0eWxlID0gcmVxdWlyZSgnLi9zdHlsZScpO1xudmFyIHRlbXBsYXRlID0gcmVxdWlyZSgnLi90ZW1wbGF0ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXBwbHlBbnNpU3R5bGVzOiBzdHlsZS5hcHBseUFuc2lTdHlsZXMsXG4gIGNvbmNhdEZpcnN0U3RyaW5nRWxlbWVudHM6IHRlbXBsYXRlLmNvbmNhdEZpcnN0U3RyaW5nRWxlbWVudHMsXG4gIGN1c3RvbUZvcm1hdHRlckZhY3Rvcnk6IGN1c3RvbUZvcm1hdHRlckZhY3RvcnksXG4gIG1heERlcHRoRmFjdG9yeTogb2JqZWN0Lm1heERlcHRoRmFjdG9yeSxcbiAgcmVtb3ZlU3R5bGVzOiBzdHlsZS5yZW1vdmVTdHlsZXMsXG4gIHRvSlNPTjogb2JqZWN0LnRvSlNPTixcbiAgdG9TdHJpbmc6IG9iamVjdC50b1N0cmluZyxcbiAgdHJhbnNmb3JtOiB0cmFuc2Zvcm0sXG59O1xuXG5mdW5jdGlvbiBjdXN0b21Gb3JtYXR0ZXJGYWN0b3J5KGN1c3RvbUZvcm1hdCwgY29uY2F0Rmlyc3QsIHNjb3BlT3B0aW9ucykge1xuICBpZiAodHlwZW9mIGN1c3RvbUZvcm1hdCA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gY3VzdG9tU3RyaW5nRm9ybWF0dGVyKGRhdGEsIG1lc3NhZ2UpIHtcbiAgICAgIHJldHVybiB0cmFuc2Zvcm0obWVzc2FnZSwgW1xuICAgICAgICB0ZW1wbGF0ZS50ZW1wbGF0ZVZhcmlhYmxlcyxcbiAgICAgICAgdGVtcGxhdGUudGVtcGxhdGVTY29wZUZhY3Rvcnkoc2NvcGVPcHRpb25zKSxcbiAgICAgICAgdGVtcGxhdGUudGVtcGxhdGVEYXRlLFxuICAgICAgICB0ZW1wbGF0ZS50ZW1wbGF0ZVRleHQsXG4gICAgICAgIGNvbmNhdEZpcnN0ICYmIHRlbXBsYXRlLmNvbmNhdEZpcnN0U3RyaW5nRWxlbWVudHMsXG4gICAgICBdLCBbY3VzdG9tRm9ybWF0XS5jb25jYXQoZGF0YSkpO1xuICAgIH07XG4gIH1cblxuICBpZiAodHlwZW9mIGN1c3RvbUZvcm1hdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmdW5jdGlvbiBjdXN0b21GdW5jdGlvbkZvcm1hdHRlcihkYXRhLCBtZXNzYWdlKSB7XG4gICAgICB2YXIgbW9kaWZpZWRNZXNzYWdlID0gT2JqZWN0LmFzc2lnbih7fSwgbWVzc2FnZSwgeyBkYXRhOiBkYXRhIH0pO1xuICAgICAgdmFyIHRleHRzID0gY3VzdG9tRm9ybWF0KG1vZGlmaWVkTWVzc2FnZSwgZGF0YSk7XG4gICAgICByZXR1cm4gW10uY29uY2F0KHRleHRzKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgcmV0dXJuIFtdLmNvbmNhdChkYXRhKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdHJhbnNmb3JtKG1lc3NhZ2UsIHRyYW5zZm9ybWVycywgaW5pdGlhbERhdGEpIHtcbiAgcmV0dXJuIHRyYW5zZm9ybWVycy5yZWR1Y2UoZnVuY3Rpb24gKGRhdGEsIHRyYW5zZm9ybWVyKSB7XG4gICAgaWYgKHR5cGVvZiB0cmFuc2Zvcm1lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHRyYW5zZm9ybWVyKGRhdGEsIG1lc3NhZ2UpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9LCBpbml0aWFsRGF0YSB8fCBtZXNzYWdlLmRhdGEpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1heERlcHRoRmFjdG9yeTogbWF4RGVwdGhGYWN0b3J5LFxuICBzZXJpYWxpemU6IHNlcmlhbGl6ZSxcbiAgdG9KU09OOiB0b0pTT04sXG4gIHRvU3RyaW5nOiB0b1N0cmluZyxcbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlcmlhbGl6ZXIoKSB7XG4gIHZhciBzZWVuID0gY3JlYXRlV2Vha1NldCgpO1xuXG4gIHJldHVybiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICE9PSBudWxsKSB7XG4gICAgICBpZiAoc2Vlbi5oYXModmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHNlZW4uYWRkKHZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VyaWFsaXplKGtleSwgdmFsdWUpO1xuICB9O1xufVxuXG4vKipcbiAqIEByZXR1cm4ge1dlYWtTZXQ8b2JqZWN0Pn1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlV2Vha1NldCgpIHtcbiAgaWYgKHR5cGVvZiBXZWFrU2V0ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBuZXcgV2Vha1NldCgpO1xuICB9XG5cbiAgdmFyIGNhY2hlID0gW107XG4gIHRoaXMuYWRkID0gZnVuY3Rpb24gKHZhbHVlKSB7IGNhY2hlLnB1c2godmFsdWUpIH07XG4gIHRoaXMuaGFzID0gZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBjYWNoZS5pbmRleE9mKHZhbHVlKSAhPT0gLTEgfTtcblxuICByZXR1cm4gdGhpcztcbn1cblxuZnVuY3Rpb24gbWF4RGVwdGgoZGF0YSwgZGVwdGgpIHtcbiAgaWYgKCFkYXRhKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBpZiAoZGVwdGggPCAxKSB7XG4gICAgaWYgKGRhdGEubWFwKSByZXR1cm4gJ1thcnJheV0nO1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ29iamVjdCcpIHJldHVybiAnW29iamVjdF0nO1xuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBpZiAodHlwZW9mIGRhdGEubWFwID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGRhdGEubWFwKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgcmV0dXJuIG1heERlcHRoKGNoaWxkLCBkZXB0aCAtIDEpO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBkYXRhICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgaWYgKGRhdGEgJiYgdHlwZW9mIGRhdGEudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIC8vIG5vaW5zcGVjdGlvbiBQb2ludGxlc3NCb29sZWFuRXhwcmVzc2lvbkpTXG4gIGlmIChkYXRhID09PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoZGF0YSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICB2YXIgbmV3SnNvbiA9IHt9O1xuICBmb3IgKHZhciBpIGluIGRhdGEpIHtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBpKSkgY29udGludWU7XG4gICAgbmV3SnNvbltpXSA9IG1heERlcHRoKGRhdGFbaV0sIGRlcHRoIC0gMSk7XG4gIH1cblxuICByZXR1cm4gbmV3SnNvbjtcbn1cblxuZnVuY3Rpb24gbWF4RGVwdGhGYWN0b3J5KGRlcHRoKSB7XG4gIGRlcHRoID0gZGVwdGggfHwgNjtcblxuICByZXR1cm4gZnVuY3Rpb24gbWF4RGVwdGhGdW5jdGlvbihkYXRhKSB7XG4gICAgcmV0dXJuIG1heERlcHRoKGRhdGEsIGRlcHRoKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2VyaWFsaXplKGtleSwgdmFsdWUpIHtcbiAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICB2YXIgb2JqZWN0ID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIHtcbiAgICAgICAgY29uc3RydWN0b3I6ICh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lKSB8fCAnRXJyb3InLFxuICAgICAgfSxcbiAgICAgIHZhbHVlLFxuICAgICAgeyBzdGFjazogdmFsdWUuc3RhY2sgfVxuICAgICk7XG5cbiAgICBpZiAoIW9iamVjdC5zdGFjaykge1xuICAgICAgb2JqZWN0Lm1lc3NhZ2UgPSB2YWx1ZS5tZXNzYWdlO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICBvYmplY3QuY29uc3RydWN0b3IgPSB2YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgIH1cblxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZS50b0pTT04gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdmFsdWUudG9KU09OKCk7XG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuICdbZnVuY3Rpb25dICcgKyB2YWx1ZS50b1N0cmluZygpO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiB0b0pTT04oZGF0YSkge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhLCBjcmVhdGVTZXJpYWxpemVyKCkpKTtcbn1cblxuZnVuY3Rpb24gdG9TdHJpbmcoZGF0YSkge1xuICB2YXIgc2ltcGxpZmllZERhdGEgPSBkYXRhLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgIGlmIChpdGVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoaXRlbSwgY3JlYXRlU2VyaWFsaXplcigpLCAnICAnKSk7XG4gIH0pO1xuXG4gIHJldHVybiB1dGlsLmZvcm1hdC5hcHBseSh1dGlsLCBzaW1wbGlmaWVkRGF0YSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhcHBseUFuc2lTdHlsZXM6IGFwcGx5QW5zaVN0eWxlcyxcbiAgcmVtb3ZlU3R5bGVzOiByZW1vdmVTdHlsZXMsXG4gIHRyYW5zZm9ybVN0eWxlczogdHJhbnNmb3JtU3R5bGVzLFxufTtcblxudmFyIEFOU0lfQ09MT1JTID0ge1xuICB1bnNldDogJ1xceDFiWzBtJyxcbiAgYmxhY2s6ICdcXHgxYlszMG0nLFxuICByZWQ6ICdcXHgxYlszMW0nLFxuICBncmVlbjogJ1xceDFiWzMybScsXG4gIHllbGxvdzogJ1xceDFiWzMzbScsXG4gIGJsdWU6ICdcXHgxYlszNG0nLFxuICBtYWdlbnRhOiAnXFx4MWJbMzVtJyxcbiAgY3lhbjogJ1xceDFiWzM2bScsXG4gIHdoaXRlOiAnXFx4MWJbMzdtJyxcbn07XG5cbmZ1bmN0aW9uIGFwcGx5QW5zaVN0eWxlcyhkYXRhKSB7XG4gIHJldHVybiB0cmFuc2Zvcm1TdHlsZXMoZGF0YSwgc3R5bGVUb0Fuc2ksIHJlc2V0QW5zaVN0eWxlKTtcbn1cblxuZnVuY3Rpb24gc3R5bGVUb0Fuc2koc3R5bGUpIHtcbiAgdmFyIGNvbG9yID0gc3R5bGUucmVwbGFjZSgvY29sb3I6XFxzKihcXHcrKS4qLywgJyQxJykudG9Mb3dlckNhc2UoKTtcbiAgcmV0dXJuIEFOU0lfQ09MT1JTW2NvbG9yXSB8fCAnJztcbn1cblxuZnVuY3Rpb24gcmVzZXRBbnNpU3R5bGUoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcgKyBBTlNJX0NPTE9SUy51bnNldDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVzKGRhdGEpIHtcbiAgcmV0dXJuIHRyYW5zZm9ybVN0eWxlcyhkYXRhLCBmdW5jdGlvbiAoKSB7IHJldHVybiAnJyB9KTtcbn1cblxuZnVuY3Rpb24gdHJhbnNmb3JtU3R5bGVzKGRhdGEsIG9uU3R5bGVGb3VuZCwgb25TdHlsZUFwcGxpZWQpIHtcbiAgdmFyIGZvdW5kU3R5bGVzID0ge307XG5cbiAgcmV0dXJuIGRhdGEucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIGl0ZW0sIGluZGV4LCBhcnJheSkge1xuICAgIGlmIChmb3VuZFN0eWxlc1tpbmRleF0pIHtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xuICAgICAgdmFyIHZhbHVlSW5kZXggPSBpbmRleDtcbiAgICAgIHZhciBzdHlsZUFwcGxpZWQgPSBmYWxzZTtcblxuICAgICAgaXRlbSA9IGl0ZW0ucmVwbGFjZSgvJVsxY2RmaU9vc10vZywgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgIHZhbHVlSW5kZXggKz0gMTtcblxuICAgICAgICBpZiAobWF0Y2ggIT09ICclYycpIHtcbiAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3R5bGUgPSBhcnJheVt2YWx1ZUluZGV4XTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdHlsZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBmb3VuZFN0eWxlc1t2YWx1ZUluZGV4XSA9IHRydWU7XG4gICAgICAgICAgc3R5bGVBcHBsaWVkID0gdHJ1ZTtcbiAgICAgICAgICByZXR1cm4gb25TdHlsZUZvdW5kKHN0eWxlLCBpdGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoc3R5bGVBcHBsaWVkICYmIG9uU3R5bGVBcHBsaWVkKSB7XG4gICAgICAgIGl0ZW0gPSBvblN0eWxlQXBwbGllZChpdGVtKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LCBbXSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjb25jYXRGaXJzdFN0cmluZ0VsZW1lbnRzOiBjb25jYXRGaXJzdFN0cmluZ0VsZW1lbnRzLFxuICBmb3JtYXREYXRlOiBmb3JtYXREYXRlLFxuICBmb3JtYXRUaW1lWm9uZTogZm9ybWF0VGltZVpvbmUsXG4gIHBhZDogcGFkLFxuICBwYWRTdHJpbmc6IHBhZFN0cmluZyxcbiAgdGVtcGxhdGVEYXRlOiB0ZW1wbGF0ZURhdGUsXG4gIHRlbXBsYXRlVmFyaWFibGVzOiB0ZW1wbGF0ZVZhcmlhYmxlcyxcbiAgdGVtcGxhdGVTY29wZUZhY3Rvcnk6IHRlbXBsYXRlU2NvcGVGYWN0b3J5LFxuICB0ZW1wbGF0ZVRleHQ6IHRlbXBsYXRlVGV4dCxcbn07XG5cbi8qKlxuICogVGhlIGZpcnN0IGFyZ3VtZW50IG9mIGNvbnNvbGUubG9nIG1heSBjb250YWluIHRlbXBsYXRlcy4gSW4gdGhlIGxpYnJhcnlcbiAqIHRoZSBmaXJzdCBlbGVtZW50IGlzIGEgc3RyaW5nIHJlbGF0ZWQgdG8gdHJhbnNwb3J0cy5jb25zb2xlLmZvcm1hdC4gU29cbiAqIHRoaXMgZnVuY3Rpb24gY29uY2F0ZW5hdGVzIGZpcnN0IHR3byBlbGVtZW50cyB0byBtYWtlIHRlbXBsYXRlcyBsaWtlICVkXG4gKiB3b3JrXG4gKiBAcGFyYW0geypbXX0gZGF0YVxuICogQHJldHVybiB7KltdfVxuICovXG5mdW5jdGlvbiBjb25jYXRGaXJzdFN0cmluZ0VsZW1lbnRzKGRhdGEpIHtcbiAgaWYgKHR5cGVvZiBkYXRhWzBdICE9PSAnc3RyaW5nJyB8fCB0eXBlb2YgZGF0YVsxXSAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGlmIChkYXRhWzBdLm1hdGNoKC8lWzFjZGZpT29zXS8pKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBkYXRhWzFdID0gZGF0YVswXSArICcgJyArIGRhdGFbMV07XG4gIGRhdGEuc2hpZnQoKTtcblxuICByZXR1cm4gZGF0YTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0RGF0ZSh0ZW1wbGF0ZSwgZGF0ZSkge1xuICByZXR1cm4gdGVtcGxhdGVcbiAgICAucmVwbGFjZSgne3l9JywgU3RyaW5nKGRhdGUuZ2V0RnVsbFllYXIoKSkpXG4gICAgLnJlcGxhY2UoJ3ttfScsIHBhZChkYXRlLmdldE1vbnRoKCkgKyAxKSlcbiAgICAucmVwbGFjZSgne2R9JywgcGFkKGRhdGUuZ2V0RGF0ZSgpKSlcbiAgICAucmVwbGFjZSgne2h9JywgcGFkKGRhdGUuZ2V0SG91cnMoKSkpXG4gICAgLnJlcGxhY2UoJ3tpfScsIHBhZChkYXRlLmdldE1pbnV0ZXMoKSkpXG4gICAgLnJlcGxhY2UoJ3tzfScsIHBhZChkYXRlLmdldFNlY29uZHMoKSkpXG4gICAgLnJlcGxhY2UoJ3ttc30nLCBwYWQoZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSwgMykpXG4gICAgLnJlcGxhY2UoJ3t6fScsIGZvcm1hdFRpbWVab25lKGRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKSkpXG4gICAgLnJlcGxhY2UoJ3tpc299JywgZGF0ZS50b0lTT1N0cmluZygpKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0VGltZVpvbmUobWludXRlc09mZnNldCkge1xuICB2YXIgbSA9IE1hdGguYWJzKG1pbnV0ZXNPZmZzZXQpO1xuICByZXR1cm4gKG1pbnV0ZXNPZmZzZXQgPj0gMCA/ICctJyA6ICcrJylcbiAgICArIHBhZChNYXRoLmZsb29yKG0gLyA2MCkpICsgJzonXG4gICAgKyBwYWQobSAlIDYwKTtcbn1cblxuZnVuY3Rpb24gcGFkKG51bWJlciwgemVyb3MpIHtcbiAgemVyb3MgPSB6ZXJvcyB8fCAyO1xuICByZXR1cm4gKG5ldyBBcnJheSh6ZXJvcyArIDEpLmpvaW4oJzAnKSArIG51bWJlcikuc3Vic3RyKC16ZXJvcywgemVyb3MpO1xufVxuXG5mdW5jdGlvbiBwYWRTdHJpbmcodmFsdWUsIGxlbmd0aCkge1xuICBsZW5ndGggPSBNYXRoLm1heChsZW5ndGgsIHZhbHVlLmxlbmd0aCk7XG4gIHZhciBwYWRWYWx1ZSA9IEFycmF5KGxlbmd0aCArIDEpLmpvaW4oJyAnKTtcbiAgcmV0dXJuICh2YWx1ZSArIHBhZFZhbHVlKS5zdWJzdHJpbmcoMCwgbGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gdGVtcGxhdGVEYXRlKGRhdGEsIG1lc3NhZ2UpIHtcbiAgdmFyIHRlbXBsYXRlID0gZGF0YVswXTtcbiAgaWYgKHR5cGVvZiB0ZW1wbGF0ZSAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGRhdGFbMF0gPSBmb3JtYXREYXRlKHRlbXBsYXRlLCBtZXNzYWdlLmRhdGUpO1xuICByZXR1cm4gZGF0YTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3sgbGFiZWxMZW5ndGg6IG51bWJlciwgZGVmYXVsdExhYmVsOiBzdHJpbmcgfX0gb3B0aW9uc1xuICovXG5mdW5jdGlvbiB0ZW1wbGF0ZVNjb3BlRmFjdG9yeShvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICB2YXIgbGFiZWxMZW5ndGggPSBvcHRpb25zLmxhYmVsTGVuZ3RoIHx8IDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHRlbXBsYXRlU2NvcGUoZGF0YSwgbWVzc2FnZSkge1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRhdGFbMF07XG4gICAgdmFyIGxhYmVsID0gbWVzc2FnZS5zY29wZSAmJiBtZXNzYWdlLnNjb3BlLmxhYmVsO1xuXG4gICAgaWYgKCFsYWJlbCkge1xuICAgICAgbGFiZWwgPSBvcHRpb25zLmRlZmF1bHRMYWJlbDtcbiAgICB9XG5cbiAgICB2YXIgc2NvcGVUZXh0O1xuICAgIGlmIChsYWJlbCA9PT0gJycpIHtcbiAgICAgIHNjb3BlVGV4dCA9IGxhYmVsTGVuZ3RoID4gMCA/IHBhZFN0cmluZygnJywgbGFiZWxMZW5ndGggKyAzKSA6ICcnO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGxhYmVsID09PSAnc3RyaW5nJykge1xuICAgICAgc2NvcGVUZXh0ID0gcGFkU3RyaW5nKCcgKCcgKyBsYWJlbCArICcpJywgbGFiZWxMZW5ndGggKyAzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2NvcGVUZXh0ID0gJyc7XG4gICAgfVxuXG4gICAgZGF0YVswXSA9IHRlbXBsYXRlLnJlcGxhY2UoJ3tzY29wZX0nLCBzY29wZVRleHQpO1xuICAgIHJldHVybiBkYXRhO1xuICB9O1xufVxuXG5mdW5jdGlvbiB0ZW1wbGF0ZVZhcmlhYmxlcyhkYXRhLCBtZXNzYWdlKSB7XG4gIHZhciB0ZW1wbGF0ZSA9IGRhdGFbMF07XG4gIHZhciB2YXJpYWJsZXMgPSBtZXNzYWdlLnZhcmlhYmxlcztcblxuICBpZiAodHlwZW9mIHRlbXBsYXRlICE9PSAnc3RyaW5nJyB8fCAhbWVzc2FnZS52YXJpYWJsZXMpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGZvciAodmFyIGkgaW4gdmFyaWFibGVzKSB7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFyaWFibGVzLCBpKSkgY29udGludWU7XG4gICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZS5yZXBsYWNlKCd7JyArIGkgKyAnfScsIHZhcmlhYmxlc1tpXSk7XG4gIH1cblxuICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UoJ3tsZXZlbH0nLCBtZXNzYWdlLmxldmVsKTtcblxuICBkYXRhWzBdID0gdGVtcGxhdGU7XG4gIHJldHVybiBkYXRhO1xufVxuXG5mdW5jdGlvbiB0ZW1wbGF0ZVRleHQoZGF0YSkge1xuICB2YXIgdGVtcGxhdGUgPSBkYXRhWzBdO1xuICBpZiAodHlwZW9mIHRlbXBsYXRlICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgdmFyIHRleHRUcGxQb3NpdGlvbiA9IHRlbXBsYXRlLmxhc3RJbmRleE9mKCd7dGV4dH0nKTtcbiAgaWYgKHRleHRUcGxQb3NpdGlvbiA9PT0gdGVtcGxhdGUubGVuZ3RoIC0gNikge1xuICAgIGRhdGFbMF0gPSB0ZW1wbGF0ZS5yZXBsYWNlKC9cXHM/e3RleHR9LywgJycpO1xuICAgIGlmIChkYXRhWzBdID09PSAnJykge1xuICAgICAgZGF0YS5zaGlmdCgpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgdmFyIHRlbXBsYXRlUGllY2VzID0gdGVtcGxhdGUuc3BsaXQoJ3t0ZXh0fScpO1xuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgaWYgKHRlbXBsYXRlUGllY2VzWzBdICE9PSAnJykge1xuICAgIHJlc3VsdC5wdXNoKHRlbXBsYXRlUGllY2VzWzBdKTtcbiAgfVxuXG4gIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQoZGF0YS5zbGljZSgxKSk7XG5cbiAgaWYgKHRlbXBsYXRlUGllY2VzWzFdICE9PSAnJykge1xuICAgIHJlc3VsdC5wdXNoKHRlbXBsYXRlUGllY2VzWzFdKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLW11bHRpLXNwYWNlcywgbm8tY29uc29sZSAqL1xuXG52YXIgdHJhbnNmb3JtID0gcmVxdWlyZSgnLi4vdHJhbnNmb3JtJyk7XG5cbnZhciBvcmlnaW5hbCA9IHtcbiAgY29udGV4dDogY29uc29sZSxcbiAgZXJyb3I6ICAgY29uc29sZS5lcnJvcixcbiAgd2FybjogICAgY29uc29sZS53YXJuLFxuICBpbmZvOiAgICBjb25zb2xlLmluZm8sXG4gIHZlcmJvc2U6IGNvbnNvbGUudmVyYm9zZSxcbiAgZGVidWc6ICAgY29uc29sZS5kZWJ1ZyxcbiAgc2lsbHk6ICAgY29uc29sZS5zaWxseSxcbiAgbG9nOiAgICAgY29uc29sZS5sb2csXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnNvbGVUcmFuc3BvcnRGYWN0b3J5O1xubW9kdWxlLmV4cG9ydHMudHJhbnNmb3JtUmVuZGVyZXIgPSB0cmFuc2Zvcm1SZW5kZXJlcjtcbm1vZHVsZS5leHBvcnRzLnRyYW5zZm9ybU1haW4gPSB0cmFuc2Zvcm1NYWluO1xuXG52YXIgc2VwYXJhdG9yID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyA/ICc+JyA6ICfigLonO1xudmFyIERFRkFVTFRfRk9STUFUID0ge1xuICBicm93c2VyOiAnJWN7aH06e2l9OntzfS57bXN9e3Njb3BlfSVjICcgKyBzZXBhcmF0b3IgKyAnIHt0ZXh0fScsXG4gIHJlbmRlcmVyOiAne2h9OntpfTp7c30ue21zfXtzY29wZX0g4oC6IHt0ZXh0fScsXG4gIHdvcmtlcjogJ3tofTp7aX06e3N9Lnttc317c2NvcGV9IOKAuiB7dGV4dH0nLFxufTtcblxuZnVuY3Rpb24gY29uc29sZVRyYW5zcG9ydEZhY3RvcnkoZWxlY3Ryb25Mb2cpIHtcbiAgdHJhbnNwb3J0LmxldmVsICA9ICdzaWxseSc7XG4gIHRyYW5zcG9ydC51c2VTdHlsZXMgPSBwcm9jZXNzLmVudi5GT1JDRV9TVFlMRVM7XG4gIHRyYW5zcG9ydC5mb3JtYXQgPSBERUZBVUxUX0ZPUk1BVFtwcm9jZXNzLnR5cGVdIHx8IERFRkFVTFRfRk9STUFULmJyb3dzZXI7XG5cbiAgcmV0dXJuIHRyYW5zcG9ydDtcblxuICBmdW5jdGlvbiB0cmFuc3BvcnQobWVzc2FnZSkge1xuICAgIHZhciBzY29wZU9wdGlvbnMgPSBlbGVjdHJvbkxvZy5zY29wZS5nZXRPcHRpb25zKCk7XG5cbiAgICB2YXIgZGF0YTtcbiAgICBpZiAocHJvY2Vzcy50eXBlID09PSAncmVuZGVyZXInIHx8IHByb2Nlc3MudHlwZSA9PT0gJ3dvcmtlcicpIHtcbiAgICAgIGRhdGEgPSB0cmFuc2Zvcm1SZW5kZXJlcihtZXNzYWdlLCB0cmFuc3BvcnQsIHNjb3BlT3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSB0cmFuc2Zvcm1NYWluKG1lc3NhZ2UsIHRyYW5zcG9ydCwgc2NvcGVPcHRpb25zKTtcbiAgICB9XG5cbiAgICBjb25zb2xlTG9nKG1lc3NhZ2UubGV2ZWwsIGRhdGEpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHRyYW5zZm9ybVJlbmRlcmVyKG1lc3NhZ2UsIHRyYW5zcG9ydCwgc2NvcGVPcHRpb25zKSB7XG4gIHJldHVybiB0cmFuc2Zvcm0udHJhbnNmb3JtKG1lc3NhZ2UsIFtcbiAgICB0cmFuc2Zvcm0uY3VzdG9tRm9ybWF0dGVyRmFjdG9yeSh0cmFuc3BvcnQuZm9ybWF0LCB0cnVlLCBzY29wZU9wdGlvbnMpLFxuICBdKTtcbn1cblxuZnVuY3Rpb24gdHJhbnNmb3JtTWFpbihtZXNzYWdlLCB0cmFuc3BvcnQsIHNjb3BlT3B0aW9ucykge1xuICB2YXIgdXNlU3R5bGVzID0gY2FuVXNlU3R5bGVzKHRyYW5zcG9ydC51c2VTdHlsZXMsIG1lc3NhZ2UubGV2ZWwpO1xuXG4gIHJldHVybiB0cmFuc2Zvcm0udHJhbnNmb3JtKG1lc3NhZ2UsIFtcbiAgICBhZGRUZW1wbGF0ZUNvbG9yRmFjdG9yeSh0cmFuc3BvcnQuZm9ybWF0KSxcbiAgICB0cmFuc2Zvcm0uY3VzdG9tRm9ybWF0dGVyRmFjdG9yeSh0cmFuc3BvcnQuZm9ybWF0LCBmYWxzZSwgc2NvcGVPcHRpb25zKSxcbiAgICB1c2VTdHlsZXMgPyB0cmFuc2Zvcm0uYXBwbHlBbnNpU3R5bGVzIDogdHJhbnNmb3JtLnJlbW92ZVN0eWxlcyxcbiAgICB0cmFuc2Zvcm0uY29uY2F0Rmlyc3RTdHJpbmdFbGVtZW50cyxcbiAgICB0cmFuc2Zvcm0ubWF4RGVwdGhGYWN0b3J5KDQpLFxuICAgIHRyYW5zZm9ybS50b0pTT04sXG4gIF0pO1xufVxuXG5mdW5jdGlvbiBhZGRUZW1wbGF0ZUNvbG9yRmFjdG9yeShmb3JtYXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGFkZFRlbXBsYXRlQ29sb3JzKGRhdGEsIG1lc3NhZ2UpIHtcbiAgICBpZiAoZm9ybWF0ICE9PSBERUZBVUxUX0ZPUk1BVC5icm93c2VyKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICByZXR1cm4gWydjb2xvcjonICsgbGV2ZWxUb1N0eWxlKG1lc3NhZ2UubGV2ZWwpLCAnY29sb3I6dW5zZXQnXS5jb25jYXQoZGF0YSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGNhblVzZVN0eWxlcyh1c2VTdHlsZVZhbHVlLCBsZXZlbCkge1xuICBpZiAodXNlU3R5bGVWYWx1ZSA9PT0gdHJ1ZSB8fCB1c2VTdHlsZVZhbHVlID09PSBmYWxzZSkge1xuICAgIHJldHVybiB1c2VTdHlsZVZhbHVlO1xuICB9XG5cbiAgdmFyIHVzZVN0ZGVyciA9IGxldmVsID09PSAnZXJyb3InIHx8IGxldmVsID09PSAnd2Fybic7XG4gIHZhciBzdHJlYW0gPSB1c2VTdGRlcnIgPyBwcm9jZXNzLnN0ZGVyciA6IHByb2Nlc3Muc3Rkb3V0O1xuICByZXR1cm4gc3RyZWFtICYmIHN0cmVhbS5pc1RUWTtcbn1cblxuZnVuY3Rpb24gY29uc29sZUxvZyhsZXZlbCwgYXJncykge1xuICBpZiAob3JpZ2luYWxbbGV2ZWxdKSB7XG4gICAgb3JpZ2luYWxbbGV2ZWxdLmFwcGx5KG9yaWdpbmFsLmNvbnRleHQsIGFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIG9yaWdpbmFsLmxvZy5hcHBseShvcmlnaW5hbC5jb250ZXh0LCBhcmdzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBsZXZlbFRvU3R5bGUobGV2ZWwpIHtcbiAgc3dpdGNoIChsZXZlbCkge1xuICAgIGNhc2UgJ2Vycm9yJzogcmV0dXJuICdyZWQnO1xuICAgIGNhc2UgJ3dhcm4nOiAgcmV0dXJuICd5ZWxsb3cnO1xuICAgIGNhc2UgJ2luZm8nOiAgcmV0dXJuICdjeWFuJztcbiAgICBkZWZhdWx0OiAgICAgIHJldHVybiAndW5zZXQnO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKTtcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgb3MgPSByZXF1aXJlKCdvcycpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEZpbGU6IEZpbGUsXG4gIEZpbGVSZWdpc3RyeTogRmlsZVJlZ2lzdHJ5LFxuICBOdWxsRmlsZTogTnVsbEZpbGUsXG59O1xuXG4vKipcbiAqIEZpbGUgbWFuaXB1bGF0aW9ucyBvbiBmaWxlc3lzdGVtXG4gKiBAY2xhc3NcbiAqIEBleHRlbmRzIEV2ZW50RW1pdHRlclxuICogQHByb3BlcnR5IHtudW1iZXJ9IHNpemVcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aFxuICogQHBhcmFtIHtXcml0ZU9wdGlvbnN9IFt3cml0ZU9wdGlvbnNdXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFt3cml0ZUFzeW5jXVxuICovXG5mdW5jdGlvbiBGaWxlKGZpbGVQYXRoLCB3cml0ZU9wdGlvbnMsIHdyaXRlQXN5bmMpIHtcbiAgRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtzdHJpbmd9XG4gICAqIEByZWFkb25seVxuICAgKi9cbiAgdGhpcy5wYXRoID0gZmlsZVBhdGg7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtudW1iZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0aGlzLmluaXRpYWxTaXplID0gdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIHRoaXMuYnl0ZXNXcml0dGVuID0gMDtcblxuICAvKipcbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0aGlzLndyaXRlQXN5bmMgPSBCb29sZWFuKHdyaXRlQXN5bmMpO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7c3RyaW5nW119XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0aGlzLmFzeW5jV3JpdGVRdWV1ZSA9IFtdO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7V3JpdGVPcHRpb25zfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgdGhpcy53cml0ZU9wdGlvbnMgPSB3cml0ZU9wdGlvbnMgfHwge1xuICAgIGZsYWc6ICdhJyxcbiAgICBtb2RlOiA0MzgsIC8vIDA2NjZcbiAgICBlbmNvZGluZzogJ3V0ZjgnLFxuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnc2l6ZScsIHtcbiAgICBnZXQ6IHRoaXMuZ2V0U2l6ZS5iaW5kKHRoaXMpLFxuICB9KTtcbn1cblxudXRpbC5pbmhlcml0cyhGaWxlLCBFdmVudEVtaXR0ZXIpO1xuXG5GaWxlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgdHJ5IHtcbiAgICBmcy53cml0ZUZpbGVTeW5jKHRoaXMucGF0aCwgJycsIHtcbiAgICAgIG1vZGU6IHRoaXMud3JpdGVPcHRpb25zLm1vZGUsXG4gICAgICBmbGFnOiAndycsXG4gICAgfSk7XG4gICAgdGhpcy5yZXNldCgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGUuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMuZW1pdCgnZXJyb3InLCBlLCB0aGlzKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbkZpbGUucHJvdG90eXBlLmNyb3AgPSBmdW5jdGlvbiAoYnl0ZXNBZnRlcikge1xuICB0cnkge1xuICAgIHZhciBjb250ZW50ID0gcmVhZEZpbGVTeW5jRnJvbUVuZCh0aGlzLnBhdGgsIGJ5dGVzQWZ0ZXIgfHwgNDA5Nik7XG4gICAgdGhpcy5jbGVhcigpO1xuICAgIHRoaXMud3JpdGVMaW5lKCdbbG9nIGNyb3BwZWRdJyArIG9zLkVPTCArIGNvbnRlbnQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhpcy5lbWl0KFxuICAgICAgJ2Vycm9yJyxcbiAgICAgIG5ldyBFcnJvcignQ291bGRuXFwndCBjcm9wIGZpbGUgJyArIHRoaXMucGF0aCArICcuICcgKyBlLm1lc3NhZ2UpLFxuICAgICAgdGhpc1xuICAgICk7XG4gIH1cbn07XG5cbkZpbGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5wYXRoO1xufTtcblxuLyoqXG4gKiBAcGFja2FnZVxuICovXG5GaWxlLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5pbml0aWFsU2l6ZSA9IHVuZGVmaW5lZDtcbiAgdGhpcy5ieXRlc1dyaXR0ZW4gPSAwO1xufTtcblxuLyoqXG4gKiBAcGFja2FnZVxuICovXG5GaWxlLnByb3RvdHlwZS53cml0ZUxpbmUgPSBmdW5jdGlvbiAodGV4dCkge1xuICB0ZXh0ICs9IG9zLkVPTDtcblxuICBpZiAodGhpcy53cml0ZUFzeW5jKSB7XG4gICAgdGhpcy5hc3luY1dyaXRlUXVldWUucHVzaCh0ZXh0KTtcbiAgICB0aGlzLm5leHRBc3luY1dyaXRlKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBmcy53cml0ZUZpbGVTeW5jKHRoaXMucGF0aCwgdGV4dCwgdGhpcy53cml0ZU9wdGlvbnMpO1xuICAgIHRoaXMuaW5jcmVhc2VCeXRlc1dyaXR0ZW5Db3VudGVyKHRleHQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdGhpcy5lbWl0KFxuICAgICAgJ2Vycm9yJyxcbiAgICAgIG5ldyBFcnJvcignQ291bGRuXFwndCB3cml0ZSB0byAnICsgdGhpcy5wYXRoICsgJy4gJyArIGUubWVzc2FnZSksXG4gICAgICB0aGlzXG4gICAgKTtcbiAgfVxufTtcblxuLyoqXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKiBAcHJvdGVjdGVkXG4gKi9cbkZpbGUucHJvdG90eXBlLmdldFNpemUgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmluaXRpYWxTaXplID09PSB1bmRlZmluZWQpIHtcbiAgICB0cnkge1xuICAgICAgdmFyIHN0YXRzID0gZnMuc3RhdFN5bmModGhpcy5wYXRoKTtcbiAgICAgIHRoaXMuaW5pdGlhbFNpemUgPSBzdGF0cy5zaXplO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMuaW5pdGlhbFNpemUgPSAwO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzLmluaXRpYWxTaXplICsgdGhpcy5ieXRlc1dyaXR0ZW47XG59O1xuXG4vKipcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKiBAcGFja2FnZVxuICovXG5GaWxlLnByb3RvdHlwZS5pc051bGwgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuRmlsZS5wcm90b3R5cGUuaW5jcmVhc2VCeXRlc1dyaXR0ZW5Db3VudGVyID0gZnVuY3Rpb24gKHRleHQpIHtcbiAgdGhpcy5ieXRlc1dyaXR0ZW4gKz0gQnVmZmVyLmJ5dGVMZW5ndGgodGV4dCwgdGhpcy53cml0ZU9wdGlvbnMuZW5jb2RpbmcpO1xufTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5GaWxlLnByb3RvdHlwZS5uZXh0QXN5bmNXcml0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGZpbGUgPSB0aGlzO1xuXG4gIGlmICh0aGlzLmFzeW5jV3JpdGVRdWV1ZS5sZW5ndGggPCAxKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHRleHQgPSB0aGlzLmFzeW5jV3JpdGVRdWV1ZS5zaGlmdCgpO1xuXG4gIGZzLndyaXRlRmlsZSh0aGlzLnBhdGgsIHRleHQsIHRoaXMud3JpdGVPcHRpb25zLCBmdW5jdGlvbiAoZSkge1xuICAgIGlmIChlKSB7XG4gICAgICBmaWxlLmVtaXQoXG4gICAgICAgICdlcnJvcicsXG4gICAgICAgIG5ldyBFcnJvcignQ291bGRuXFwndCB3cml0ZSB0byAnICsgZmlsZS5wYXRoICsgJy4gJyArIGUubWVzc2FnZSksXG4gICAgICAgIHRoaXNcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbGUuaW5jcmVhc2VCeXRlc1dyaXR0ZW5Db3VudGVyKHRleHQpO1xuICAgIH1cblxuICAgIGZpbGUubmV4dEFzeW5jV3JpdGUoKTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIEZpbGUgbWFuaXB1bGF0aW9ucyBvbiBmaWxlc3lzdGVtXG4gKiBAY2xhc3NcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaXplXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGhcbiAqL1xuZnVuY3Rpb24gTnVsbEZpbGUoZmlsZVBhdGgpIHtcbiAgRmlsZS5jYWxsKHRoaXMsIGZpbGVQYXRoKTtcbn1cblxudXRpbC5pbmhlcml0cyhOdWxsRmlsZSwgRmlsZSk7XG5cbk51bGxGaWxlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHt9O1xuTnVsbEZpbGUucHJvdG90eXBlLmNyb3AgPSBmdW5jdGlvbiAoKSB7fTtcbk51bGxGaWxlLnByb3RvdHlwZS53cml0ZUxpbmUgPSBmdW5jdGlvbiAoKSB7fTtcbk51bGxGaWxlLnByb3RvdHlwZS5nZXRTaXplID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gMCB9O1xuTnVsbEZpbGUucHJvdG90eXBlLmlzTnVsbCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWUgfTtcblxuLyoqXG4gKiBDb2xsZWN0aW9uLCBrZXkgaXMgYSBmaWxlIHBhdGgsIHZhbHVlIGlzIGEgRmlsZSBpbnN0YW5jZVxuICogQGNsYXNzXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEZpbGVSZWdpc3RyeSgpIHtcbiAgRXZlbnRFbWl0dGVyLmNhbGwodGhpcyk7XG4gIHRoaXMuc3RvcmUgPSB7fTtcblxuICB0aGlzLmVtaXRFcnJvciA9IHRoaXMuZW1pdEVycm9yLmJpbmQodGhpcyk7XG59XG5cbnV0aWwuaW5oZXJpdHMoRmlsZVJlZ2lzdHJ5LCBFdmVudEVtaXR0ZXIpO1xuXG4vKipcbiAqIFByb3ZpZGUgYSBGaWxlIG9iamVjdCBjb3JyZXNwb25kaW5nIHRvIHRoZSBmaWxlUGF0aFxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoXG4gKiBAcGFyYW0ge1dyaXRlT3B0aW9uc30gW3dyaXRlT3B0aW9uc11cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2FzeW5jXVxuICogQHJldHVybiB7RmlsZX1cbiAqL1xuRmlsZVJlZ2lzdHJ5LnByb3RvdHlwZS5wcm92aWRlID0gZnVuY3Rpb24gKGZpbGVQYXRoLCB3cml0ZU9wdGlvbnMsIGFzeW5jKSB7XG4gIHZhciBmaWxlO1xuICB0cnkge1xuICAgIGZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKGZpbGVQYXRoKTtcblxuICAgIGlmICh0aGlzLnN0b3JlW2ZpbGVQYXRoXSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RvcmVbZmlsZVBhdGhdO1xuICAgIH1cblxuICAgIGZpbGUgPSB0aGlzLmNyZWF0ZUZpbGUoZmlsZVBhdGgsIHdyaXRlT3B0aW9ucywgQm9vbGVhbihhc3luYykpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZmlsZSA9IG5ldyBOdWxsRmlsZShmaWxlUGF0aCk7XG4gICAgdGhpcy5lbWl0RXJyb3IoZSwgZmlsZSk7XG4gIH1cblxuICBmaWxlLm9uKCdlcnJvcicsIHRoaXMuZW1pdEVycm9yKTtcbiAgdGhpcy5zdG9yZVtmaWxlUGF0aF0gPSBmaWxlO1xuICByZXR1cm4gZmlsZTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoXG4gKiBAcGFyYW0ge1dyaXRlT3B0aW9uc30gd3JpdGVPcHRpb25zXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFzeW5jXG4gKiBAcmV0dXJuIHtGaWxlfVxuICogQHByaXZhdGVcbiAqL1xuRmlsZVJlZ2lzdHJ5LnByb3RvdHlwZS5jcmVhdGVGaWxlID0gZnVuY3Rpb24gKGZpbGVQYXRoLCB3cml0ZU9wdGlvbnMsIGFzeW5jKSB7XG4gIHRoaXMudGVzdEZpbGVXcml0aW5nKGZpbGVQYXRoKTtcbiAgcmV0dXJuIG5ldyBGaWxlKGZpbGVQYXRoLCB3cml0ZU9wdGlvbnMsIGFzeW5jKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3JcbiAqIEBwYXJhbSB7RmlsZX0gZmlsZVxuICogQHByaXZhdGVcbiAqL1xuRmlsZVJlZ2lzdHJ5LnByb3RvdHlwZS5lbWl0RXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IsIGZpbGUpIHtcbiAgdGhpcy5lbWl0KCdlcnJvcicsIGVycm9yLCBmaWxlKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoXG4gKiBAcHJpdmF0ZVxuICovXG5GaWxlUmVnaXN0cnkucHJvdG90eXBlLnRlc3RGaWxlV3JpdGluZyA9IGZ1bmN0aW9uIChmaWxlUGF0aCkge1xuICBta0RpcihwYXRoLmRpcm5hbWUoZmlsZVBhdGgpKTtcbiAgZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgJycsIHsgZmxhZzogJ2EnIH0pO1xufTtcblxuZnVuY3Rpb24gbWtEaXIoZGlyUGF0aCkge1xuICBpZiAoY2hlY2tOb2RlSnNWZXJzaW9uKDEwLjEyKSkge1xuICAgIGZzLm1rZGlyU3luYyhkaXJQYXRoLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgZnMubWtkaXJTeW5jKGRpclBhdGgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmIChlcnJvci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgcmV0dXJuIG1rRGlyKHBhdGguZGlybmFtZShkaXJQYXRoKSkgJiYgbWtEaXIoZGlyUGF0aCk7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGlmIChmcy5zdGF0U3luYyhkaXJQYXRoKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBub2luc3BlY3Rpb24gRXhjZXB0aW9uQ2F1Z2h0TG9jYWxseUpTXG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja05vZGVKc1ZlcnNpb24odmVyc2lvbikge1xuICBpZiAoIXByb2Nlc3MudmVyc2lvbnMpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgbm9kZVZlcnNpb24gPSBOdW1iZXIoXG4gICAgcHJvY2Vzcy52ZXJzaW9uLm1hdGNoKC9edihcXGQrXFwuXFxkKykvKVsxXS5yZXBsYWNlKC9cXC4oXFxkKSQvLCAnLjAkMScpXG4gICk7XG5cbiAgcmV0dXJuIG5vZGVWZXJzaW9uID49IHZlcnNpb247XG59XG5cbmZ1bmN0aW9uIHJlYWRGaWxlU3luY0Zyb21FbmQoZmlsZVBhdGgsIGJ5dGVzQ291bnQpIHtcbiAgdmFyIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyhieXRlc0NvdW50KTtcbiAgdmFyIHN0YXRzID0gZnMuc3RhdFN5bmMoZmlsZVBhdGgpO1xuXG4gIHZhciByZWFkTGVuZ3RoID0gTWF0aC5taW4oc3RhdHMuc2l6ZSwgYnl0ZXNDb3VudCk7XG4gIHZhciBvZmZzZXQgPSBNYXRoLm1heCgwLCBzdGF0cy5zaXplIC0gYnl0ZXNDb3VudCk7XG5cbiAgdmFyIGZkID0gZnMub3BlblN5bmMoZmlsZVBhdGgsICdyJyk7XG4gIHZhciB0b3RhbEJ5dGVzID0gZnMucmVhZFN5bmMoZmQsIGJ1ZmZlciwgMCwgcmVhZExlbmd0aCwgb2Zmc2V0KTtcbiAgZnMuY2xvc2VTeW5jKGZkKTtcblxuICByZXR1cm4gYnVmZmVyLnRvU3RyaW5nKCd1dGY4JywgMCwgdG90YWxCeXRlcyk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbCcpO1xudmFyIHRyYW5zZm9ybSA9IHJlcXVpcmUoJy4uLy4uL3RyYW5zZm9ybScpO1xudmFyIEZpbGVSZWdpc3RyeSA9IHJlcXVpcmUoJy4vZmlsZScpLkZpbGVSZWdpc3RyeTtcbnZhciB2YXJpYWJsZXMgPSByZXF1aXJlKCcuL3ZhcmlhYmxlcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbGVUcmFuc3BvcnRGYWN0b3J5O1xuXG4vLyBTaGFyZWQgYmV0d2VlbiBtdWx0aXBsZSBmaWxlIHRyYW5zcG9ydCBpbnN0YW5jZXNcbnZhciBnbG9iYWxSZWdpc3RyeSA9IG5ldyBGaWxlUmVnaXN0cnkoKTtcblxuZnVuY3Rpb24gZmlsZVRyYW5zcG9ydEZhY3RvcnkoZWxlY3Ryb25Mb2csIGN1c3RvbVJlZ2lzdHJ5KSB7XG4gIHZhciBwYXRoVmFyaWFibGVzID0gdmFyaWFibGVzLmdldFBhdGhWYXJpYWJsZXMocHJvY2Vzcy5wbGF0Zm9ybSk7XG5cbiAgdmFyIHJlZ2lzdHJ5ID0gY3VzdG9tUmVnaXN0cnkgfHwgZ2xvYmFsUmVnaXN0cnk7XG4gIHJlZ2lzdHJ5Lm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlLCBmaWxlKSB7XG4gICAgbG9nQ29uc29sZSgnQ2FuXFwndCB3cml0ZSB0byAnICsgZmlsZSwgZSk7XG4gIH0pO1xuXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLW11bHRpLXNwYWNlcyAqL1xuICB0cmFuc3BvcnQuYXJjaGl2ZUxvZyAgID0gYXJjaGl2ZUxvZztcbiAgdHJhbnNwb3J0LmZpbGVOYW1lICAgICA9IGdldERlZmF1bHRGaWxlTmFtZSgpO1xuICB0cmFuc3BvcnRcbiAgICAuZm9ybWF0ID0gJ1t7eX0te219LXtkfSB7aH06e2l9OntzfS57bXN9XSBbe2xldmVsfV17c2NvcGV9IHt0ZXh0fSc7XG4gIHRyYW5zcG9ydC5nZXRGaWxlICAgICAgPSBnZXRGaWxlO1xuICB0cmFuc3BvcnQubGV2ZWwgICAgICAgID0gJ3NpbGx5JztcbiAgdHJhbnNwb3J0Lm1heFNpemUgICAgICA9IDEwMjQgKiAxMDI0O1xuICB0cmFuc3BvcnQucmVzb2x2ZVBhdGggID0gcmVzb2x2ZVBhdGg7XG4gIHRyYW5zcG9ydC5zeW5jICAgICAgICAgPSB0cnVlO1xuICB0cmFuc3BvcnQud3JpdGVPcHRpb25zID0ge1xuICAgIGZsYWc6ICdhJyxcbiAgICBtb2RlOiA0MzgsIC8vIDA2NjZcbiAgICBlbmNvZGluZzogJ3V0ZjgnLFxuICB9O1xuXG4gIGluaXREZXByZWNhdGVkKCk7XG5cbiAgcmV0dXJuIHRyYW5zcG9ydDtcblxuICBmdW5jdGlvbiB0cmFuc3BvcnQobWVzc2FnZSkge1xuICAgIHZhciBmaWxlID0gZ2V0RmlsZShtZXNzYWdlKTtcblxuICAgIHZhciBuZWVkTG9nUm90YXRpb24gPSB0cmFuc3BvcnQubWF4U2l6ZSA+IDBcbiAgICAgICYmIGZpbGUuc2l6ZSA+IHRyYW5zcG9ydC5tYXhTaXplO1xuXG4gICAgaWYgKG5lZWRMb2dSb3RhdGlvbikge1xuICAgICAgdHJhbnNwb3J0LmFyY2hpdmVMb2coZmlsZSk7XG4gICAgICBmaWxlLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgdmFyIHNjb3BlT3B0aW9ucyA9IGVsZWN0cm9uTG9nLnNjb3BlLmdldE9wdGlvbnMoKTtcbiAgICB2YXIgY29udGVudCA9IHRyYW5zZm9ybS50cmFuc2Zvcm0obWVzc2FnZSwgW1xuICAgICAgdHJhbnNmb3JtLnJlbW92ZVN0eWxlcyxcbiAgICAgIHRyYW5zZm9ybS5jdXN0b21Gb3JtYXR0ZXJGYWN0b3J5KHRyYW5zcG9ydC5mb3JtYXQsIGZhbHNlLCBzY29wZU9wdGlvbnMpLFxuICAgICAgdHJhbnNmb3JtLmNvbmNhdEZpcnN0U3RyaW5nRWxlbWVudHMsXG4gICAgICB0cmFuc2Zvcm0ubWF4RGVwdGhGYWN0b3J5KCksXG4gICAgICB0cmFuc2Zvcm0udG9TdHJpbmcsXG4gICAgXSk7XG5cbiAgICBmaWxlLndyaXRlTGluZShjb250ZW50KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFyY2hpdmVMb2coZmlsZSkge1xuICAgIHZhciBvbGRQYXRoID0gZmlsZS50b1N0cmluZygpO1xuICAgIHZhciBpbmYgPSBwYXRoLnBhcnNlKG9sZFBhdGgpO1xuICAgIHRyeSB7XG4gICAgICBmcy5yZW5hbWVTeW5jKG9sZFBhdGgsIHBhdGguam9pbihpbmYuZGlyLCBpbmYubmFtZSArICcub2xkJyArIGluZi5leHQpKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBsb2dDb25zb2xlKCdDb3VsZCBub3Qgcm90YXRlIGxvZycsIGUpO1xuICAgICAgdmFyIHF1YXJ0ZXJPZk1heFNpemUgPSBNYXRoLnJvdW5kKHRyYW5zcG9ydC5tYXhTaXplIC8gNCk7XG4gICAgICBmaWxlLmNyb3AoTWF0aC5taW4ocXVhcnRlck9mTWF4U2l6ZSwgMjU2ICogMTAyNCkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGxvZ0NvbnNvbGUobWVzc2FnZSwgZXJyb3IpIHtcbiAgICB2YXIgZGF0YSA9IFsnZWxlY3Ryb24tbG9nLnRyYW5zcG9ydHMuZmlsZTogJyArIG1lc3NhZ2VdO1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBkYXRhLnB1c2goZXJyb3IpO1xuICAgIH1cblxuICAgIGVsZWN0cm9uTG9nLnRyYW5zcG9ydHMuY29uc29sZSh7XG4gICAgICBkYXRhOiBkYXRhLFxuICAgICAgZGF0ZTogbmV3IERhdGUoKSxcbiAgICAgIGxldmVsOiAnd2FybicsXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRGaWxlKG1zZykge1xuICAgIHZhciB2YXJzID0gT2JqZWN0LmFzc2lnbih7fSwgcGF0aFZhcmlhYmxlcywge1xuICAgICAgZmlsZU5hbWU6IHRyYW5zcG9ydC5maWxlTmFtZSxcbiAgICB9KTtcblxuICAgIHZhciBmaWxlUGF0aCA9IHRyYW5zcG9ydC5yZXNvbHZlUGF0aCh2YXJzLCBtc2cpO1xuICAgIHJldHVybiByZWdpc3RyeS5wcm92aWRlKGZpbGVQYXRoLCB0cmFuc3BvcnQud3JpdGVPcHRpb25zLCAhdHJhbnNwb3J0LnN5bmMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7UGF0aFZhcmlhYmxlc30gdmFyc1xuICAgKi9cbiAgZnVuY3Rpb24gcmVzb2x2ZVBhdGgodmFycykge1xuICAgIHJldHVybiBwYXRoLmpvaW4odmFycy5saWJyYXJ5RGVmYXVsdERpciwgdmFycy5maWxlTmFtZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0RGVwcmVjYXRlZCgpIHtcbiAgICB2YXIgaXNEZXByZWNhdGVkVGV4dCA9ICcgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHY1Lic7XG4gICAgdmFyIGlzRGVwcmVjYXRlZFByb3AgPSAnIHByb3BlcnR5JyArIGlzRGVwcmVjYXRlZFRleHQ7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0cmFuc3BvcnQsIHtcbiAgICAgIGJ5dGVzV3JpdHRlbjoge1xuICAgICAgICBnZXQ6IHV0aWwuZGVwcmVjYXRlKGdldEJ5dGVzV3JpdHRlbiwgJ2J5dGVzV3JpdHRlbicgKyBpc0RlcHJlY2F0ZWRQcm9wKSxcbiAgICAgIH0sXG5cbiAgICAgIGZpbGU6IHtcbiAgICAgICAgZ2V0OiB1dGlsLmRlcHJlY2F0ZShnZXRMb2dGaWxlLCAnZmlsZScgKyBpc0RlcHJlY2F0ZWRQcm9wKSxcbiAgICAgICAgc2V0OiB1dGlsLmRlcHJlY2F0ZShzZXRMb2dGaWxlLCAnZmlsZScgKyBpc0RlcHJlY2F0ZWRQcm9wKSxcbiAgICAgIH0sXG5cbiAgICAgIGZpbGVTaXplOiB7XG4gICAgICAgIGdldDogdXRpbC5kZXByZWNhdGUoZ2V0RmlsZVNpemUsICdmaWxlJyArIGlzRGVwcmVjYXRlZFByb3ApLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRyYW5zcG9ydC5jbGVhciA9IHV0aWwuZGVwcmVjYXRlKGNsZWFyLCAnY2xlYXIoKScgKyBpc0RlcHJlY2F0ZWRUZXh0KTtcbiAgICB0cmFuc3BvcnQuZmluZExvZ1BhdGggPSB1dGlsLmRlcHJlY2F0ZShcbiAgICAgIGdldExvZ0ZpbGUsXG4gICAgICAnZmluZExvZ1BhdGgoKScgKyBpc0RlcHJlY2F0ZWRUZXh0XG4gICAgKTtcbiAgICB0cmFuc3BvcnQuaW5pdCA9IHV0aWwuZGVwcmVjYXRlKGluaXQsICdpbml0KCknICsgaXNEZXByZWNhdGVkVGV4dCk7XG5cbiAgICBmdW5jdGlvbiBnZXRCeXRlc1dyaXR0ZW4oKSB7XG4gICAgICByZXR1cm4gZ2V0RmlsZSgpLmJ5dGVzV3JpdHRlbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRMb2dGaWxlKCkge1xuICAgICAgcmV0dXJuIGdldEZpbGUoKS5wYXRoO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldExvZ0ZpbGUoZmlsZVBhdGgpIHtcbiAgICAgIHRyYW5zcG9ydC5yZXNvbHZlUGF0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZpbGVQYXRoO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRGaWxlU2l6ZSgpIHtcbiAgICAgIHJldHVybiBnZXRGaWxlKCkuc2l6ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgIGdldEZpbGUoKS5jbGVhcigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXQoKSB7fVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRGaWxlTmFtZSgpIHtcbiAgc3dpdGNoIChwcm9jZXNzLnR5cGUpIHtcbiAgICBjYXNlICdyZW5kZXJlcic6IHJldHVybiAncmVuZGVyZXIubG9nJztcbiAgICBjYXNlICd3b3JrZXInOiByZXR1cm4gJ3dvcmtlci5sb2cnO1xuICAgIGRlZmF1bHQ6IHJldHVybiAnbWFpbi5sb2cnO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qIGVzbGludC1kaXNhYmxlIGNvbnNpc3RlbnQtcmV0dXJuICovXG5cbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlYWRQYWNrYWdlSnNvbjogcmVhZFBhY2thZ2VKc29uLFxuICB0cnlSZWFkSnNvbkF0OiB0cnlSZWFkSnNvbkF0LFxufTtcblxuLyoqXG4gKiBAcmV0dXJuIHt7IG5hbWU/OiBzdHJpbmcsIHZlcnNpb24/OiBzdHJpbmd9fVxuICovXG5mdW5jdGlvbiByZWFkUGFja2FnZUpzb24oKSB7XG4gIHJldHVybiB0cnlSZWFkSnNvbkF0KHJlcXVpcmUubWFpbiAmJiByZXF1aXJlLm1haW4uZmlsZW5hbWUpXG4gICAgfHwgdHJ5UmVhZEpzb25BdChwcm9jZXNzLnJlc291cmNlc1BhdGgsICdhcHAuYXNhcicpXG4gICAgfHwgdHJ5UmVhZEpzb25BdChwcm9jZXNzLmN3ZCgpKVxuICAgIHx8IHsgbmFtZTogbnVsbCwgdmVyc2lvbjogbnVsbCB9O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7Li4uc3RyaW5nfSBzZWFyY2hQYXRoXG4gKiBAcmV0dXJuIHt7IG5hbWU/OiBzdHJpbmcsIHZlcnNpb24/OiBzdHJpbmcgfSB8IG51bGx9XG4gKi9cbmZ1bmN0aW9uIHRyeVJlYWRKc29uQXQoc2VhcmNoUGF0aCkge1xuICB0cnkge1xuICAgIHNlYXJjaFBhdGggPSBwYXRoLmpvaW4uYXBwbHkocGF0aCwgYXJndW1lbnRzKTtcbiAgICB2YXIgZmlsZU5hbWUgPSBmaW5kVXAoJ3BhY2thZ2UuanNvbicsIHNlYXJjaFBhdGgpO1xuICAgIGlmICghZmlsZU5hbWUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHZhciBqc29uID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZmlsZU5hbWUsICd1dGY4JykpO1xuICAgIHZhciBuYW1lID0ganNvbi5wcm9kdWN0TmFtZSB8fCBqc29uLm5hbWU7XG4gICAgaWYgKCFuYW1lIHx8IG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2VsZWN0cm9uJykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgaWYgKGpzb24ucHJvZHVjdE5hbWUgfHwganNvbi5uYW1lKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICB2ZXJzaW9uOiBqc29uLnZlcnNpb24sXG4gICAgICB9O1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVOYW1lXG4gKiBAcGFyYW0ge3N0cmluZ30gW2N3ZF1cbiAqIEByZXR1cm4ge3N0cmluZyB8IG51bGx9XG4gKi9cbmZ1bmN0aW9uIGZpbmRVcChmaWxlTmFtZSwgY3dkKSB7XG4gIHZhciBjdXJyZW50UGF0aCA9IGN3ZDtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnN0YW50LWNvbmRpdGlvblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHZhciBwYXJzZWRQYXRoID0gcGF0aC5wYXJzZShjdXJyZW50UGF0aCk7XG4gICAgdmFyIHJvb3QgPSBwYXJzZWRQYXRoLnJvb3Q7XG4gICAgdmFyIGRpciA9IHBhcnNlZFBhdGguZGlyO1xuXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aC5qb2luKGN1cnJlbnRQYXRoLCBmaWxlTmFtZSkpKSB7XG4gICAgICByZXR1cm4gcGF0aC5yZXNvbHZlKHBhdGguam9pbihjdXJyZW50UGF0aCwgZmlsZU5hbWUpKTtcbiAgICB9XG5cbiAgICBpZiAoY3VycmVudFBhdGggPT09IHJvb3QpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGN1cnJlbnRQYXRoID0gZGlyO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBvcyA9IHJlcXVpcmUoJ29zJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciBlbGVjdHJvbkFwaSA9IHJlcXVpcmUoJy4uLy4uL2VsZWN0cm9uQXBpJyk7XG52YXIgcGFja2FnZUpzb24gPSByZXF1aXJlKCcuL3BhY2thZ2VKc29uJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRBcHBEYXRhOiBnZXRBcHBEYXRhLFxuICBnZXRMaWJyYXJ5RGVmYXVsdERpcjogZ2V0TGlicmFyeURlZmF1bHREaXIsXG4gIGdldExpYnJhcnlUZW1wbGF0ZTogZ2V0TGlicmFyeVRlbXBsYXRlLFxuICBnZXROYW1lQW5kVmVyc2lvbjogZ2V0TmFtZUFuZFZlcnNpb24sXG4gIGdldFBhdGhWYXJpYWJsZXM6IGdldFBhdGhWYXJpYWJsZXMsXG4gIGdldFVzZXJEYXRhOiBnZXRVc2VyRGF0YSxcbn07XG5cbmZ1bmN0aW9uIGdldEFwcERhdGEocGxhdGZvcm0pIHtcbiAgdmFyIGFwcERhdGEgPSBlbGVjdHJvbkFwaS5nZXRQYXRoKCdhcHBEYXRhJyk7XG4gIGlmIChhcHBEYXRhKSB7XG4gICAgcmV0dXJuIGFwcERhdGE7XG4gIH1cblxuICB2YXIgaG9tZSA9IGdldEhvbWUoKTtcblxuICBzd2l0Y2ggKHBsYXRmb3JtKSB7XG4gICAgY2FzZSAnZGFyd2luJzoge1xuICAgICAgcmV0dXJuIHBhdGguam9pbihob21lLCAnTGlicmFyeS9BcHBsaWNhdGlvbiBTdXBwb3J0Jyk7XG4gICAgfVxuXG4gICAgY2FzZSAnd2luMzInOiB7XG4gICAgICByZXR1cm4gcHJvY2Vzcy5lbnYuQVBQREFUQSB8fCBwYXRoLmpvaW4oaG9tZSwgJ0FwcERhdGEvUm9hbWluZycpO1xuICAgIH1cblxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHJldHVybiBwcm9jZXNzLmVudi5YREdfQ09ORklHX0hPTUUgfHwgcGF0aC5qb2luKGhvbWUsICcuY29uZmlnJyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldEhvbWUoKSB7XG4gIHJldHVybiBvcy5ob21lZGlyID8gb3MuaG9tZWRpcigpIDogcHJvY2Vzcy5lbnYuSE9NRTtcbn1cblxuZnVuY3Rpb24gZ2V0TGlicmFyeURlZmF1bHREaXIocGxhdGZvcm0sIGFwcE5hbWUpIHtcbiAgaWYgKHBsYXRmb3JtID09PSAnZGFyd2luJykge1xuICAgIHJldHVybiBwYXRoLmpvaW4oZ2V0SG9tZSgpLCAnTGlicmFyeS9Mb2dzJywgYXBwTmFtZSk7XG4gIH1cblxuICByZXR1cm4gcGF0aC5qb2luKGdldFVzZXJEYXRhKHBsYXRmb3JtLCBhcHBOYW1lKSwgJ2xvZ3MnKTtcbn1cblxuZnVuY3Rpb24gZ2V0TGlicmFyeVRlbXBsYXRlKHBsYXRmb3JtKSB7XG4gIGlmIChwbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKGdldEhvbWUoKSwgJ0xpYnJhcnkvTG9ncycsICd7YXBwTmFtZX0nKTtcbiAgfVxuXG4gIHJldHVybiBwYXRoLmpvaW4oZ2V0QXBwRGF0YShwbGF0Zm9ybSksICd7YXBwTmFtZX0nLCAnbG9ncycpO1xufVxuXG5mdW5jdGlvbiBnZXROYW1lQW5kVmVyc2lvbigpIHtcbiAgdmFyIG5hbWUgPSBlbGVjdHJvbkFwaS5nZXROYW1lKCk7XG4gIHZhciB2ZXJzaW9uID0gZWxlY3Ryb25BcGkuZ2V0VmVyc2lvbigpO1xuXG4gIGlmIChuYW1lICYmIHZlcnNpb24pIHtcbiAgICByZXR1cm4geyBuYW1lOiBuYW1lLCB2ZXJzaW9uOiB2ZXJzaW9uIH07XG4gIH1cblxuICB2YXIgcGFja2FnZVZhbHVlcyA9IHBhY2thZ2VKc29uLnJlYWRQYWNrYWdlSnNvbigpO1xuICBpZiAoIW5hbWUpIHtcbiAgICBuYW1lID0gcGFja2FnZVZhbHVlcy5uYW1lO1xuICB9XG5cbiAgaWYgKCF2ZXJzaW9uKSB7XG4gICAgdmVyc2lvbiA9IHBhY2thZ2VWYWx1ZXMudmVyc2lvbjtcbiAgfVxuXG4gIHJldHVybiB7IG5hbWU6IG5hbWUsIHZlcnNpb246IHZlcnNpb24gfTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGxhdGZvcm1cbiAqIEByZXR1cm4ge1BhdGhWYXJpYWJsZXN9XG4gKi9cbmZ1bmN0aW9uIGdldFBhdGhWYXJpYWJsZXMocGxhdGZvcm0pIHtcbiAgdmFyIG5hbWVBbmRWZXJzaW9uID0gZ2V0TmFtZUFuZFZlcnNpb24oKTtcbiAgdmFyIGFwcE5hbWUgPSBuYW1lQW5kVmVyc2lvbi5uYW1lO1xuICB2YXIgYXBwVmVyc2lvbiA9IG5hbWVBbmRWZXJzaW9uLnZlcnNpb247XG5cbiAgcmV0dXJuIHtcbiAgICBhcHBEYXRhOiBnZXRBcHBEYXRhKHBsYXRmb3JtKSxcbiAgICBhcHBOYW1lOiBhcHBOYW1lLFxuICAgIGFwcFZlcnNpb246IGFwcFZlcnNpb24sXG4gICAgZWxlY3Ryb25EZWZhdWx0RGlyOiBlbGVjdHJvbkFwaS5nZXRQYXRoKCdsb2dzJyksXG4gICAgaG9tZTogZ2V0SG9tZSgpLFxuICAgIGxpYnJhcnlEZWZhdWx0RGlyOiBnZXRMaWJyYXJ5RGVmYXVsdERpcihwbGF0Zm9ybSwgYXBwTmFtZSksXG4gICAgbGlicmFyeVRlbXBsYXRlOiBnZXRMaWJyYXJ5VGVtcGxhdGUocGxhdGZvcm0pLFxuICAgIHRlbXA6IGVsZWN0cm9uQXBpLmdldFBhdGgoJ3RlbXAnKSB8fCBvcy50bXBkaXIoKSxcbiAgICB1c2VyRGF0YTogZ2V0VXNlckRhdGEocGxhdGZvcm0sIGFwcE5hbWUpLFxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRVc2VyRGF0YShwbGF0Zm9ybSwgYXBwTmFtZSkge1xuICByZXR1cm4gZWxlY3Ryb25BcGkuZ2V0UGF0aCgndXNlckRhdGEnKVxuICAgIHx8IHBhdGguam9pbihnZXRBcHBEYXRhKHBsYXRmb3JtKSwgYXBwTmFtZSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB0cmFuc2Zvcm0gPSByZXF1aXJlKCcuLi90cmFuc2Zvcm0nKTtcbnZhciBlbGVjdHJvbkFwaSA9IHJlcXVpcmUoJy4uL2VsZWN0cm9uQXBpJyk7XG52YXIgbG9nID0gcmVxdWlyZSgnLi4vbG9nLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXBjVHJhbnNwb3J0RmFjdG9yeTtcblxuZnVuY3Rpb24gaXBjVHJhbnNwb3J0RmFjdG9yeShlbGVjdHJvbkxvZykge1xuICB0cmFuc3BvcnQuZXZlbnRJZCA9ICdfX0VMRUNUUk9OX0xPR19JUENfJyArIGVsZWN0cm9uTG9nLmxvZ0lkICsgJ19fJztcbiAgdHJhbnNwb3J0LmxldmVsID0gZWxlY3Ryb25Mb2cuaXNEZXYgPyAnc2lsbHknIDogZmFsc2U7XG5cbiAgLy8gUHJldmVudCBwcm9ibGVtcyB3aGVuIHRoZXJlIGFyZSBtdWx0aXBsZSBpbnN0YW5jZXMgYWZ0ZXIgd2VicGFja1xuICBpZiAoZWxlY3Ryb25BcGkuaXNJcGNDaGFubmVsTGlzdGVuZWQodHJhbnNwb3J0LmV2ZW50SWQpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHt9O1xuICB9XG5cbiAgZWxlY3Ryb25BcGkub25JcGModHJhbnNwb3J0LmV2ZW50SWQsIGZ1bmN0aW9uIChfLCBtZXNzYWdlKSB7XG4gICAgbWVzc2FnZS5kYXRlID0gbmV3IERhdGUobWVzc2FnZS5kYXRlKTtcblxuICAgIGxvZy5ydW5UcmFuc3BvcnQoXG4gICAgICBlbGVjdHJvbkxvZy50cmFuc3BvcnRzLmNvbnNvbGUsXG4gICAgICBtZXNzYWdlLFxuICAgICAgZWxlY3Ryb25Mb2dcbiAgICApO1xuICB9KTtcblxuICBlbGVjdHJvbkFwaS5sb2FkUmVtb3RlTW9kdWxlKCdlbGVjdHJvbi1sb2cnKTtcblxuICByZXR1cm4gZWxlY3Ryb25BcGkuaXNFbGVjdHJvbigpID8gdHJhbnNwb3J0IDogbnVsbDtcblxuICBmdW5jdGlvbiB0cmFuc3BvcnQobWVzc2FnZSkge1xuICAgIHZhciBpcGNNZXNzYWdlID0gT2JqZWN0LmFzc2lnbih7fSwgbWVzc2FnZSwge1xuICAgICAgZGF0YTogdHJhbnNmb3JtLnRyYW5zZm9ybShtZXNzYWdlLCBbXG4gICAgICAgIHRyYW5zZm9ybS5yZW1vdmVTdHlsZXMsXG4gICAgICAgIHRyYW5zZm9ybS50b0pTT04sXG4gICAgICAgIHRyYW5zZm9ybS5tYXhEZXB0aEZhY3RvcnkoMyksXG4gICAgICBdKSxcbiAgICB9KTtcblxuICAgIGVsZWN0cm9uQXBpLnNlbmRJcGModHJhbnNwb3J0LmV2ZW50SWQsIGlwY01lc3NhZ2UpO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBodHRwID0gcmVxdWlyZSgnaHR0cCcpO1xudmFyIGh0dHBzID0gcmVxdWlyZSgnaHR0cHMnKTtcbnZhciB1cmwgPSByZXF1aXJlKCd1cmwnKTtcbnZhciBsb2cgPSByZXF1aXJlKCcuLi9sb2cnKTtcbnZhciB0cmFuc2Zvcm0gPSByZXF1aXJlKCcuLi90cmFuc2Zvcm0nKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZW1vdGVUcmFuc3BvcnRGYWN0b3J5O1xuXG5mdW5jdGlvbiByZW1vdGVUcmFuc3BvcnRGYWN0b3J5KGVsZWN0cm9uTG9nKSB7XG4gIHRyYW5zcG9ydC5jbGllbnQgPSB7IG5hbWU6ICdlbGVjdHJvbi1hcHBsaWNhdGlvbicgfTtcbiAgdHJhbnNwb3J0LmRlcHRoID0gNjtcbiAgdHJhbnNwb3J0LmxldmVsID0gZmFsc2U7XG4gIHRyYW5zcG9ydC5yZXF1ZXN0T3B0aW9ucyA9IHt9O1xuICB0cmFuc3BvcnQudXJsID0gbnVsbDtcblxuICByZXR1cm4gdHJhbnNwb3J0O1xuXG4gIGZ1bmN0aW9uIHRyYW5zcG9ydChtZXNzYWdlKSB7XG4gICAgaWYgKCF0cmFuc3BvcnQudXJsKSByZXR1cm47XG5cbiAgICB2YXIgcmVxdWVzdCA9IHBvc3QodHJhbnNwb3J0LnVybCwgdHJhbnNwb3J0LnJlcXVlc3RPcHRpb25zLCB7XG4gICAgICBjbGllbnQ6IHRyYW5zcG9ydC5jbGllbnQsXG4gICAgICBkYXRhOiB0cmFuc2Zvcm0udHJhbnNmb3JtKG1lc3NhZ2UsIFtcbiAgICAgICAgdHJhbnNmb3JtLnJlbW92ZVN0eWxlcyxcbiAgICAgICAgdHJhbnNmb3JtLnRvSlNPTixcbiAgICAgICAgdHJhbnNmb3JtLm1heERlcHRoRmFjdG9yeSh0cmFuc3BvcnQuZGVwdGggKyAxKSxcbiAgICAgIF0pLFxuICAgICAgZGF0ZTogbWVzc2FnZS5kYXRlLmdldFRpbWUoKSxcbiAgICAgIGxldmVsOiBtZXNzYWdlLmxldmVsLFxuICAgICAgdmFyaWFibGVzOiBtZXNzYWdlLnZhcmlhYmxlcyxcbiAgICB9KTtcblxuICAgIHJlcXVlc3Qub24oJ2Vycm9yJywgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICB2YXIgZXJyb3JNZXNzYWdlID0ge1xuICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgJ2VsZWN0cm9uLWxvZy50cmFuc3BvcnRzLnJlbW90ZTonXG4gICAgICAgICAgKyAnIGNhbm5vdCBzZW5kIEhUVFAgcmVxdWVzdCB0byAnICsgdHJhbnNwb3J0LnVybCxcbiAgICAgICAgICBlcnJvcixcbiAgICAgICAgXSxcbiAgICAgICAgZGF0ZTogbmV3IERhdGUoKSxcbiAgICAgICAgbGV2ZWw6ICd3YXJuJyxcbiAgICAgIH07XG5cbiAgICAgIHZhciB0cmFuc3BvcnRzID0gW1xuICAgICAgICBlbGVjdHJvbkxvZy50cmFuc3BvcnRzLmNvbnNvbGUsXG4gICAgICAgIGVsZWN0cm9uTG9nLnRyYW5zcG9ydHMuaXBjLFxuICAgICAgICBlbGVjdHJvbkxvZy50cmFuc3BvcnRzLmZpbGUsXG4gICAgICBdO1xuXG4gICAgICBsb2cucnVuVHJhbnNwb3J0cyh0cmFuc3BvcnRzLCBlcnJvck1lc3NhZ2UsIGVsZWN0cm9uTG9nKTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwb3N0KHNlcnZlclVybCwgcmVxdWVzdE9wdGlvbnMsIGRhdGEpIHtcbiAgdmFyIHVybE9iamVjdCA9IHVybC5wYXJzZShzZXJ2ZXJVcmwpO1xuICB2YXIgaHR0cFRyYW5zcG9ydCA9IHVybE9iamVjdC5wcm90b2NvbCA9PT0gJ2h0dHBzOicgPyBodHRwcyA6IGh0dHA7XG5cbiAgdmFyIGJvZHkgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcblxuICB2YXIgb3B0aW9ucyA9IHtcbiAgICBob3N0bmFtZTogdXJsT2JqZWN0Lmhvc3RuYW1lLFxuICAgIHBvcnQ6ICAgICB1cmxPYmplY3QucG9ydCxcbiAgICBwYXRoOiAgICAgdXJsT2JqZWN0LnBhdGgsXG4gICAgbWV0aG9kOiAgICdQT1NUJyxcbiAgICBoZWFkZXJzOiAge1xuICAgICAgJ0NvbnRlbnQtTGVuZ3RoJzogYm9keS5sZW5ndGgsXG4gICAgICAnQ29udGVudC1UeXBlJzogICAnYXBwbGljYXRpb24vanNvbicsXG4gICAgfSxcbiAgfTtcblxuICBPYmplY3QuYXNzaWduKG9wdGlvbnMsIHJlcXVlc3RPcHRpb25zKTtcblxuICB2YXIgcmVxdWVzdCA9IGh0dHBUcmFuc3BvcnQucmVxdWVzdChvcHRpb25zKTtcbiAgcmVxdWVzdC53cml0ZShib2R5KTtcbiAgcmVxdWVzdC5lbmQoKTtcblxuICByZXR1cm4gcmVxdWVzdDtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZWxlY3Ryb25FdmVudCA9IHtcclxuICAgIC8qKiDjgrXjg7zjg5Djg7zotbfli5UgKi9cclxuICAgICdzdGFydC1zZXJ2ZXInOiAnc3RhcnQtc2VydmVyJyxcclxuICAgIC8qKiDjgrXjg7zjg5Djg7zlgZzmraIgKi9cclxuICAgICdzdG9wLXNlcnZlcic6ICdzdG9wLXNlcnZlcicsXHJcbiAgICAvKiogQ29uZmln6YGp55SoICovXHJcbiAgICAnYXBwbHktY29uZmlnJzogJ2FwcGx5LWNvbmZpZycsXHJcbiAgICAvKiog44Ki44Op44O844OI6KGo56S6ICovXHJcbiAgICAnc2hvdy1hbGVydCc6ICdzaG93LWFsZXJ0JyxcclxuICAgIC8qKiDmo5Loqq3jgb/lho3nlJ8gKi9cclxuICAgICdwbGF5LXRhbWl5YXN1JzogJ3BsYXktdGFtaXlhc3UnLFxyXG4gICAgLyoqIOODrOOCueedgOS/oemfs+WGjeeUnyAqL1xyXG4gICAgJ3BsYXktc291bmQtc3RhcnQnOiAncGxheS1zb3VuZC1zdGFydCcsXHJcbiAgICAncGxheS1zb3VuZC1lbmQnOiAncGxheS1zb3VuZC1lbmQnLFxyXG4gICAgJ3dhaXQteW9taWtvLXRpbWUnOiAnd2FpdC15b21pa28tdGltZScsXHJcbiAgICAnc3BlYWtpbmctZW5kJzogJ3NwZWFraW5nLWVuZCcsXHJcbiAgICAvKiog44Kz44Oh44Oz44OI6KGo56S6ICovXHJcbiAgICAnc2hvdy1jb21tZW50JzogJ3Nob3ctY29tbWVudCcsXHJcbiAgICAvKiog44Kz44Oh44Oz44OI5qyE5Yid5pyf5YyWICovXHJcbiAgICAnY2xlYXItY29tbWVudCc6ICdjbGVhci1jb21tZW50JyxcclxuICAgIC8qKiDjgrXjg7zjg5Djg7zotbfli5Xjga7ov5Tkv6EgKi9cclxuICAgICdzdGFydC1zZXJ2ZXItcmVwbHknOiAnc3RhcnQtc2VydmVyLXJlcGx5JyxcclxufTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcclxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH07XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufTtcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn07XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIGVsZWN0cm9uXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImVsZWN0cm9uXCIpKTtcclxudmFyIGVsZWN0cm9uX2xvZ18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJlbGVjdHJvbi1sb2dcIikpO1xyXG52YXIgY29uc3RfMSA9IHJlcXVpcmUoXCIuLi9tYWluL2NvbnN0XCIpO1xyXG52YXIgaXBjUmVuZGVyZXIgPSBlbGVjdHJvbl8xLmRlZmF1bHQuaXBjUmVuZGVyZXI7XHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zb2xlLmRlYnVnKCdbcmVuZGVyZXIuanNdRE9NIENvbnRlbnQgTG9hZGVkJyk7XHJcbiAgICAvL+ioreWumuOBruODreODvOODiVxyXG4gICAgbG9hZENvbmZpZ1RvTG9jYWxTdHJhZ2UoKTtcclxuICAgIC8v5YGc5q2i56K66KqN44OA44Kk44Ki44Ot44KwXHJcbiAgICB2YXIgZGlhbG9nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlLWRpYWxvZycpO1xyXG4gICAgLy8g44OA44Kk44Ki44Ot44Kw44Gu44Oc44K/44OzXHJcbiAgICB2YXIgY2xvc2VPa0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXR0b24tY2xvc2UtZGlhbG9nLW9rJyk7XHJcbiAgICB2YXIgY2xvc2VDYW5jZWxCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uLWNsb3NlLWRpYWxvZy1jYW5jZWwnKTtcclxuICAgIC8vIOioreWumumBqeeUqOODnOOCv+ODs1xyXG4gICAgdmFyIGFwcGx5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2J1dHRvbi1jb25maWctYXBwbHknKTtcclxuICAgIGFwcGx5QnV0dG9uLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGNvbmZpZyA9IGJ1aWxkQ29uZmlnSnNvbigpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdbcmVuZGVyZXIuanNdY29uZmlnPScpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNvbmZpZyk7XHJcbiAgICAgICAgLy/oqK3lrprmg4XloLHjgpLjg63jg7zjgqvjg6vjgrnjg4jjg6zjg7zjgrjjgbjkv53lrZhcclxuICAgICAgICBzYXZlQ29uZmlnVG9Mb2NhbFN0cmFnZShjb25maWcpO1xyXG4gICAgICAgIGlwY1JlbmRlcmVyLnNlbmQoY29uc3RfMS5lbGVjdHJvbkV2ZW50WydhcHBseS1jb25maWcnXSwgY29uZmlnKTtcclxuICAgIH07XHJcbiAgICAvLyDotbfli5Xjg7vlgZzmraLjg5zjgr/jg7NcclxuICAgIHZhciBzdGFydEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXR0b24tc2VydmVyLXN0YXJ0Jyk7XHJcbiAgICBzdGFydEJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRvZ2dsZUlucHV0Rm9ybURpc2FibGUodHJ1ZSk7XHJcbiAgICAgICAgLy/oqK3lrprmg4XloLHlj5blvpdcclxuICAgICAgICB2YXIgY29uZmlnID0gYnVpbGRDb25maWdKc29uKCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1tyZW5kZXJlci5qc11jb25maWc9Jyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coY29uZmlnKTtcclxuICAgICAgICAvL+ioreWumuaDheWgseOCkuODreODvOOCq+ODq+OCueODiOODrOODvOOCuOOBuOS/neWtmFxyXG4gICAgICAgIHNhdmVDb25maWdUb0xvY2FsU3RyYWdlKGNvbmZpZyk7XHJcbiAgICAgICAgLy8gVVJM44Go44Od44O844OI44KS5oyH5a6a44GX44Gm44GE44Gq44GE5aC05ZCI44Gv44Ko44Op44O8XHJcbiAgICAgICAgaWYgKGNvbmZpZy51cmwgPT09IG51bGwgfHwgY29uZmlnLnVybC5sZW5ndGggPCAxIHx8IGNvbmZpZy5wb3J0ID09PSBudWxsIHx8IGNvbmZpZy5wb3J0Lmxlbmd0aCA8IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDjgrXjg7zjg5Djg7zplovlp4vjg6Hjg4Pjgrvjg7zjgrjjgpLpgIHkv6HjgZnjgotcclxuICAgICAgICB2YXIgcmVzdWx0ID0gaXBjUmVuZGVyZXIuc2VuZFN5bmMoJ3N0YXJ0LXNlcnZlcicsIGNvbmZpZyk7XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhcIltyZW5kZXJlci5qc10gXCIgKyByZXN1bHQpO1xyXG4gICAgICAgIC8vIOOCteODvOODkOODvOi1t+WLleODu+WBnOatouODnOOCv+ODs+eKtuaFi+WkieabtFxyXG4gICAgICAgIHN0b3BCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBzdGFydEJ1dHRvbi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfTtcclxuICAgIC8v44K144O844OQ44O85YGc5q2i44Oc44K/44OzXHJcbiAgICB2YXIgc3RvcEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidXR0b24tc2VydmVyLXN0b3AnKTtcclxuICAgIHN0b3BCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvL+eiuuiqjeODgOOCpOOCouODreOCsOOCkuihqOekulxyXG4gICAgICAgIGRpYWxvZy5zaG93TW9kYWwoKTtcclxuICAgIH07XHJcbiAgICAvLyDjgrXjg7zjg5Djg7zlgZzmraLnorroqo3jg4DjgqTjgqLjg63jgrBcclxuICAgIGNsb3NlT2tCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gaXBjUmVuZGVyZXIuc2VuZFN5bmMoJ3N0b3Atc2VydmVyJyk7XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnW3JlbmRlcmVyLmpzXScgKyByZXN1bHQpO1xyXG4gICAgICAgIC8v44OA44Kk44Ki44Ot44Kw44Kv44Ot44O844K6XHJcbiAgICAgICAgZGlhbG9nLmNsb3NlKCk7XHJcbiAgICAgICAgdG9nZ2xlSW5wdXRGb3JtRGlzYWJsZShmYWxzZSk7XHJcbiAgICAgICAgLy8g44K144O844OQ44O86LW35YuV44O75YGc5q2i44Oc44K/44Oz54q25oWL5aSJ5pu0XHJcbiAgICAgICAgc3RhcnRCdXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBzdG9wQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9O1xyXG4gICAgY2xvc2VDYW5jZWxCdXR0b24ub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvL+ODgOOCpOOCouODreOCsOOCr+ODreODvOOCulxyXG4gICAgICAgIGRpYWxvZy5jbG9zZSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH07XHJcbn0pO1xyXG4vKipcclxuICog44K144O844OQ6LW35YuV5Lit44Gr44GE44GY44Gj44Gh44KD44GE44GR44Gq44GE6Kit5a6a44Gu5rS75oCn54q25oWL44KS5YiH44KK5pu/44GI44KLXHJcbiAqIEBwYXJhbSBpc0Rpc2FibGVkIOmdnua0u+aAp+OBquOCiXRydWVcclxuICovXHJcbnZhciB0b2dnbGVJbnB1dEZvcm1EaXNhYmxlID0gZnVuY3Rpb24gKGlzRGlzYWJsZWQpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0LXBvcnQtbnVtYmVyJykuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RleHQteW91dHViZS1pZCcpLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0LXR3aXRjaC1pZCcpLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdkaXNwU29ydCcpLmZvckVhY2goZnVuY3Rpb24gKHYsIGkpIHtcclxuICAgICAgICB2LmRpc2FibGVkID0gaXNEaXNhYmxlZDtcclxuICAgICAgICB2LnBhcmVudE5vZGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaXNEaXNhYmxlZCA/ICdsaWdodGdyYXknIDogJyc7XHJcbiAgICB9KTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGVja2JveC13b3JkQnJlYWsnKS5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hlY2tib3gtd29yZEJyZWFrJykucGFyZW50Tm9kZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBpc0Rpc2FibGVkID8gJ2xpZ2h0Z3JheScgOiAnJztcclxufTtcclxuLyoqXHJcbiAqIOioreWumlJlbmRlcuOBrkhUTUzjgYvjgonjgIFDb25maWfjgpLlj5blvpfjgZnjgotcclxuICovXHJcbnZhciBidWlsZENvbmZpZ0pzb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAvL+eUu+mdouOBi+OCieWQhOeorumgheebruOCkuWPluW+l+OBmeOCi1xyXG4gICAgdmFyIHVybCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0LXVybCcpLnZhbHVlO1xyXG4gICAgdmFyIHJlc051bWJlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0LXJlcy1udW1iZXInKS52YWx1ZTtcclxuICAgIHZhciBpbml0TWVzc2FnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0LWluaXQtbWVzc2FnZScpLnZhbHVlO1xyXG4gICAgdmFyIHBvcnQgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGV4dC1wb3J0LW51bWJlcicpLnZhbHVlKTtcclxuICAgIC8vIGNvbnN0IGRpc3BOdW1iZXIgPSBwYXJzZUludCgoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RleHQtZGlzcC1udW1iZXInKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSk7XHJcbiAgICB2YXIgZGlzcE51bWJlciA9IE5hTjtcclxuICAgIHZhciBpbnRlcnZhbCA9IHBhcnNlSW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyYW5nZVNwYW4nKS52YWx1ZSk7XHJcbiAgICB2YXIgeW91dHViZVVybCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0LXlvdXR1YmUtaWQnKS52YWx1ZTtcclxuICAgIHZhciB0d2l0Y2hVcmwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGV4dC10d2l0Y2gtaWQnKS52YWx1ZTtcclxuICAgIHZhciBzZVBhdGggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGV4dC1zZS1wYXRoJykudmFsdWU7XHJcbiAgICB2YXIgdGFtaXlhc3VQYXRoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RleHQtdGFtaXlhc3UtcGF0aCcpLnZhbHVlO1xyXG4gICAgdmFyIGJvdXlvbWlQb3J0ID0gcGFyc2VJbnQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RleHQtYm91eW9taS1wb3J0JykudmFsdWUpO1xyXG4gICAgdmFyIGJvdXlvbWlWb2x1bWUgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYm91eW9taS12b2x1bWUnKS52YWx1ZSk7XHJcbiAgICB2YXIgbm90aWZ5VGhyZWFkQ29ubmVjdGlvbkVycm9yTGltaXQgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGV4dC1ub3RpZnktdGhyZWFkQ29ubmVjdGlvbkVycm9yTGltaXQnKS52YWx1ZSk7XHJcbiAgICB2YXIgbm90aWZ5VGhyZWFkUmVzTGltaXQgPSBwYXJzZUludChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGV4dC1ub3RpZnktdGhyZWFkUmVzTGltaXQnKS52YWx1ZSk7XHJcbiAgICAvL+ODrOOCueeVquihqOekuuioreWumlxyXG4gICAgdmFyIHNob3dOdW1iZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hlY2tib3gtc2hvd051bWJlcicpLmNoZWNrZWQgPT09IHRydWU7XHJcbiAgICAvL+WQjeWJjeihqOekuuioreWumlxyXG4gICAgdmFyIHNob3dOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoZWNrYm94LXNob3dOYW1lJykuY2hlY2tlZCA9PT0gdHJ1ZTtcclxuICAgIC8v5pmC5Yi76KGo56S66Kit5a6aXHJcbiAgICB2YXIgc2hvd1RpbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hlY2tib3gtc2hvd1RpbWUnKS5jaGVja2VkID09PSB0cnVlO1xyXG4gICAgLy/oh6rli5XmlLnooYzoqK3lrppcclxuICAgIHZhciB3b3JkQnJlYWsgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hlY2tib3gtd29yZEJyZWFrJykuY2hlY2tlZCA9PT0gdHJ1ZTtcclxuICAgIC8v6KGo56S66aCG5bqP6Kit5a6aXHJcbiAgICB2YXIgZGlzcFNvcnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3UmVzVXAnKS5jaGVja2VkID09PSBmYWxzZTtcclxuICAgIC8v5pys5paH5pS56KGM6Kit5a6aXHJcbiAgICB2YXIgbmV3TGluZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbmFibGVOZXdMaW5lJykuY2hlY2tlZCA9PT0gdHJ1ZTtcclxuICAgIC8v5pys5paH5pS56KGM6Kit5a6aXHJcbiAgICB2YXIgcGxheVNlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoZWNrYm94LXBsYXlTZScpLmNoZWNrZWQgPT09IHRydWU7XHJcbiAgICB2YXIgdHlwZVlvbWlrbyA9ICdub25lJztcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCd0eXBlWW9taWtvJykuZm9yRWFjaChmdW5jdGlvbiAodikge1xyXG4gICAgICAgIHZhciBlbGVtID0gdjtcclxuICAgICAgICBpZiAoZWxlbS5jaGVja2VkKVxyXG4gICAgICAgICAgICB0eXBlWW9taWtvID0gZWxlbS52YWx1ZTtcclxuICAgIH0pO1xyXG4gICAgLy8g44Kz44Oh44Oz44OI5Yem55CGXHJcbiAgICB2YXIgY29tbWVudFByb2Nlc3NUeXBlID0gMDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdjb21tZW50UHJvY2Vzc1R5cGUnKS5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgdmFyIGVsZW0gPSB2O1xyXG4gICAgICAgIGlmIChlbGVtLmNoZWNrZWQpXHJcbiAgICAgICAgICAgIGNvbW1lbnRQcm9jZXNzVHlwZSA9IE51bWJlcihlbGVtLnZhbHVlKTtcclxuICAgIH0pO1xyXG4gICAgdmFyIGNvbmZpZyA9IHtcclxuICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICByZXNOdW1iZXI6IHJlc051bWJlcixcclxuICAgICAgICBpbml0TWVzc2FnZTogaW5pdE1lc3NhZ2UsXHJcbiAgICAgICAgcG9ydDogcG9ydCxcclxuICAgICAgICBkaXNwTnVtYmVyOiBkaXNwTnVtYmVyLFxyXG4gICAgICAgIGludGVydmFsOiBpbnRlcnZhbCxcclxuICAgICAgICB5b3V0dWJlSWQ6IHlvdXR1YmVVcmwsXHJcbiAgICAgICAgdHdpdGNoSWQ6IHR3aXRjaFVybCxcclxuICAgICAgICBkaXNwU29ydDogZGlzcFNvcnQsXHJcbiAgICAgICAgbmV3TGluZTogbmV3TGluZSxcclxuICAgICAgICBzaG93TnVtYmVyOiBzaG93TnVtYmVyLFxyXG4gICAgICAgIHNob3dOYW1lOiBzaG93TmFtZSxcclxuICAgICAgICBzaG93VGltZTogc2hvd1RpbWUsXHJcbiAgICAgICAgd29yZEJyZWFrOiB3b3JkQnJlYWssXHJcbiAgICAgICAgc2VQYXRoOiBzZVBhdGgsXHJcbiAgICAgICAgcGxheVNlOiBwbGF5U2UsXHJcbiAgICAgICAgdHlwZVlvbWlrbzogdHlwZVlvbWlrbyxcclxuICAgICAgICB0YW1peWFzdVBhdGg6IHRhbWl5YXN1UGF0aCxcclxuICAgICAgICBib3V5b21pUG9ydDogYm91eW9taVBvcnQsXHJcbiAgICAgICAgYm91eW9taVZvbHVtZTogYm91eW9taVZvbHVtZSxcclxuICAgICAgICBub3RpZnlUaHJlYWRDb25uZWN0aW9uRXJyb3JMaW1pdDogbm90aWZ5VGhyZWFkQ29ubmVjdGlvbkVycm9yTGltaXQsXHJcbiAgICAgICAgbm90aWZ5VGhyZWFkUmVzTGltaXQ6IG5vdGlmeVRocmVhZFJlc0xpbWl0LFxyXG4gICAgICAgIGNvbW1lbnRQcm9jZXNzVHlwZTogY29tbWVudFByb2Nlc3NUeXBlLFxyXG4gICAgfTtcclxuICAgIHJldHVybiBjb25maWc7XHJcbn07XHJcbi8qKlxyXG4gKiDoqK3lrprjgpLjg63jg7zjgqvjg6vjgrnjg4jjg6zjg7zjgrjjgbjkv53lrZjjgZnjgotcclxuICog44K144O844OQ44O86LW35YuV5pmC44Gr5ZG844Gz5Ye644GV44KM44KLXHJcbiAqL1xyXG52YXIgc2F2ZUNvbmZpZ1RvTG9jYWxTdHJhZ2UgPSBmdW5jdGlvbiAoY29uZmlnKSB7XHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY29uZmlnJywgSlNPTi5zdHJpbmdpZnkoY29uZmlnKSk7XHJcbiAgICBjb25zb2xlLmRlYnVnKCdbcmVuZGVyZXIuanNdY29uZmlnIHNhdmVkJyk7XHJcbn07XHJcbi8qKlxyXG4gKiDjg63jg7zjgqvjg6vjgrnjg4jjg6zjg7zjgrjjgYvjgonoqK3lrprjgpLjg63jg7zjg4njgZnjgotcclxuICovXHJcbnZhciBsb2FkQ29uZmlnVG9Mb2NhbFN0cmFnZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBpbml0Q29uZmlnID0ge1xyXG4gICAgICAgIHVybDogJycsXHJcbiAgICAgICAgcmVzTnVtYmVyOiAnJyxcclxuICAgICAgICBpbml0TWVzc2FnZTogJ+OCueODrOODg+ODieiqreOBv+i+vOOBv+OCkumWi+Wni+OBl+OBvuOBl+OBnycsXHJcbiAgICAgICAgcG9ydDogMzAwMCxcclxuICAgICAgICBpbnRlcnZhbDogMTAsXHJcbiAgICAgICAgZGlzcE51bWJlcjogTmFOLFxyXG4gICAgICAgIHlvdXR1YmVJZDogJycsXHJcbiAgICAgICAgdHdpdGNoSWQ6ICcnLFxyXG4gICAgICAgIGRpc3BTb3J0OiBmYWxzZSxcclxuICAgICAgICBuZXdMaW5lOiB0cnVlLFxyXG4gICAgICAgIHNob3dOdW1iZXI6IHRydWUsXHJcbiAgICAgICAgc2hvd05hbWU6IGZhbHNlLFxyXG4gICAgICAgIHNob3dUaW1lOiBmYWxzZSxcclxuICAgICAgICB3b3JkQnJlYWs6IHRydWUsXHJcbiAgICAgICAgc2VQYXRoOiAnJyxcclxuICAgICAgICBwbGF5U2U6IGZhbHNlLFxyXG4gICAgICAgIHR5cGVZb21pa286ICdub25lJyxcclxuICAgICAgICB0YW1peWFzdVBhdGg6ICcnLFxyXG4gICAgICAgIGJvdXlvbWlQb3J0OiA1MDAwMSxcclxuICAgICAgICBib3V5b21pVm9sdW1lOiA1MCxcclxuICAgICAgICBub3RpZnlUaHJlYWRDb25uZWN0aW9uRXJyb3JMaW1pdDogMCxcclxuICAgICAgICBub3RpZnlUaHJlYWRSZXNMaW1pdDogMCxcclxuICAgICAgICBjb21tZW50UHJvY2Vzc1R5cGU6IDAsXHJcbiAgICB9O1xyXG4gICAgdmFyIHN0b3JhZ2VTdHIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY29uZmlnJyk7XHJcbiAgICB2YXIgc3RvcmFnZUpzb24gPSBzdG9yYWdlU3RyID8gSlNPTi5wYXJzZShzdG9yYWdlU3RyKSA6IHt9O1xyXG4gICAgZ2xvYmFsVGhpcy5jb25maWcgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgaW5pdENvbmZpZyksIHN0b3JhZ2VKc29uKTtcclxuICAgIC8vIOihqOekuuOBq+WPjeaYoOOBmeOCi1xyXG4gICAgLy8g44Os44K555Wq6KGo56S65Yid5pyf5YyWXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hlY2tib3gtc2hvd051bWJlcicpLmNoZWNrZWQgPSBjb25maWcuc2hvd051bWJlcjtcclxuICAgIC8vIOWQjeWJjeihqOekuuWIneacn+WMllxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoZWNrYm94LXNob3dOYW1lJykuY2hlY2tlZCA9IGNvbmZpZy5zaG93TmFtZTtcclxuICAgIC8vIOaZguWIu+ihqOekuuWIneacn+WMllxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoZWNrYm94LXNob3dUaW1lJykuY2hlY2tlZCA9IGNvbmZpZy5zaG93VGltZTtcclxuICAgIC8vIOiHquWLleaUueihjOWIneacn+WMllxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NoZWNrYm94LXdvcmRCcmVhaycpLmNoZWNrZWQgPSBjb25maWcud29yZEJyZWFrO1xyXG4gICAgLy8g44Os44K56KGo56S66aCG44Op44K444Kq5Yid5pyf5YyWXHJcbiAgICBpZiAoY29uZmlnLmRpc3BTb3J0KSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ld1Jlc0Rvd24nKS5jaGVja2VkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXdSZXNVcCcpLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgLy8g5pS56KGM6Kit5a6a5Yid5pyf5YyWXHJcbiAgICBpZiAoY29uZmlnLm5ld0xpbmUpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW5hYmxlTmV3TGluZScpLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpc2FibGVOZXdMaW5lJykuY2hlY2tlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGV4dC1wb3J0LW51bWJlcicpLnZhbHVlID0gY29uZmlnLnBvcnQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3BhbkRpc3AnKS5pbm5lckhUTUwgPSBjb25maWcuaW50ZXJ2YWw7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmFuZ2VTcGFuJykudmFsdWUgPSBjb25maWcuaW50ZXJ2YWw7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGV4dC1pbml0LW1lc3NhZ2UnKS52YWx1ZSA9IGNvbmZpZy5pbml0TWVzc2FnZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0LXVybCcpLnZhbHVlID0gY29uZmlnLnVybDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0LXJlcy1udW1iZXInKS52YWx1ZSA9IGNvbmZpZy5yZXNOdW1iZXIudG9TdHJpbmcoKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0LXlvdXR1YmUtaWQnKS52YWx1ZSA9IGNvbmZpZy55b3V0dWJlSWQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGV4dC10d2l0Y2gtaWQnKS52YWx1ZSA9IGNvbmZpZy50d2l0Y2hJZDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0LXNlLXBhdGgnKS52YWx1ZSA9IGNvbmZpZy5zZVBhdGg7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2hlY2tib3gtcGxheVNlJykuY2hlY2tlZCA9IGNvbmZpZy5wbGF5U2U7XHJcbiAgICAvLyDoqq3jgb/lrZDjga7nqK7poZ5cclxuICAgIHN3aXRjaCAoY29uZmlnLnR5cGVZb21pa28pIHtcclxuICAgICAgICBjYXNlICdub25lJzpcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3lvbWlrb19ub25lJykuY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3RhbWl5YXN1JzpcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3lvbWlrb190YW1peWFzdScpLmNoZWNrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdib3V5b21pJzpcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3lvbWlrb19ib3V5b21pJykuY2hlY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgc3dpdGNoIChjb25maWcuY29tbWVudFByb2Nlc3NUeXBlKSB7XHJcbiAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb21tZW50UHJvY2Vzc1R5cGVfXCIgKyBjb25maWcuY29tbWVudFByb2Nlc3NUeXBlKS5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGV4dC10YW1peWFzdS1wYXRoJykudmFsdWUgPSBjb25maWcudGFtaXlhc3VQYXRoO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RleHQtYm91eW9taS1wb3J0JykudmFsdWUgPSBjb25maWcuYm91eW9taVBvcnQ7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGlzcC1ib3V5b21pLXZvbHVtZScpLmlubmVySFRNTCA9IGNvbmZpZy5ib3V5b21pVm9sdW1lO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JvdXlvbWktdm9sdW1lJykudmFsdWUgPSBjb25maWcuYm91eW9taVZvbHVtZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0ZXh0LW5vdGlmeS10aHJlYWRDb25uZWN0aW9uRXJyb3JMaW1pdCcpLnZhbHVlID0gY29uZmlnLm5vdGlmeVRocmVhZENvbm5lY3Rpb25FcnJvckxpbWl0O1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RleHQtbm90aWZ5LXRocmVhZFJlc0xpbWl0JykudmFsdWUgPSBjb25maWcubm90aWZ5VGhyZWFkUmVzTGltaXQ7XHJcbiAgICBjb25zb2xlLmRlYnVnKCdbcmVuZGVyZXIuanNdY29uZmlnIGxvYWRlZCcpO1xyXG59O1xyXG4vLyDjgrXjg7zjg5Djg7zotbfli5Xov5Tkv6FcclxuaXBjUmVuZGVyZXIub24oY29uc3RfMS5lbGVjdHJvbkV2ZW50WydzdGFydC1zZXJ2ZXItcmVwbHknXSwgZnVuY3Rpb24gKGV2ZW50LCBhcmcpIHtcclxuICAgIGNvbnNvbGUuZGVidWcoYXJnKTtcclxufSk7XHJcbi8vIOedgOS/oemfs+WGjeeUn1xyXG52YXIgYXVkaW9FbGVtID0gbmV3IEF1ZGlvKCk7XHJcbmlwY1JlbmRlcmVyLm9uKGNvbnN0XzEuZWxlY3Ryb25FdmVudFsncGxheS1zb3VuZC1zdGFydCddLCBmdW5jdGlvbiAoZXZlbnQsIHdhdmZpbGVwYXRoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGF1ZGlvRWxlbS5zcmMgPSB3YXZmaWxlcGF0aDtcclxuICAgICAgICBhdWRpb0VsZW0ucGxheSgpO1xyXG4gICAgICAgIGF1ZGlvRWxlbS5vbmVuZGVkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpcGNSZW5kZXJlci5zZW5kKGNvbnN0XzEuZWxlY3Ryb25FdmVudFsncGxheS1zb3VuZC1lbmQnXSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBhdWRpb0VsZW0ub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChjb25zdF8xLmVsZWN0cm9uRXZlbnRbJ3BsYXktc291bmQtZW5kJ10pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGVsZWN0cm9uX2xvZ18xLmRlZmF1bHQuZXJyb3IoZSk7XHJcbiAgICAgICAgaXBjUmVuZGVyZXIuc2VuZChjb25zdF8xLmVsZWN0cm9uRXZlbnRbJ3BsYXktc291bmQtZW5kJ10pO1xyXG4gICAgfVxyXG59KTtcclxuaXBjUmVuZGVyZXIub24oY29uc3RfMS5lbGVjdHJvbkV2ZW50Wyd3YWl0LXlvbWlrby10aW1lJ10sIGZ1bmN0aW9uIChldmVudCwgYXJnKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcclxuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gWzQgLyp5aWVsZCovLCB5b21pa29UaW1lKGFyZyldO1xyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICBfYS5zZW50KCk7XHJcbiAgICAgICAgICAgICAgICBpcGNSZW5kZXJlci5zZW5kKGNvbnN0XzEuZWxlY3Ryb25FdmVudFsnc3BlYWtpbmctZW5kJ10pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFsyIC8qcmV0dXJuKi9dO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KTsgfSk7XHJcbi8qKiDpn7Plo7DlkIjmiJDjgYzntYLjgo/jgaPjgabjgZ3jgYbjgarpoIPjgatyZXR1cm7ov5TjgZkgKi9cclxudmFyIHlvbWlrb1RpbWUgPSBmdW5jdGlvbiAobXNnKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgIHJldHVybiBbMiAvKnJldHVybiovLCBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHV0dHIgPSBuZXcgZ2xvYmFsVGhpcy5TcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UobXNnKTtcclxuICAgICAgICAgICAgICAgIHV0dHIudm9sdW1lID0gMDtcclxuICAgICAgICAgICAgICAgIHV0dHIub25lbmQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgc3BlZWNoU3ludGhlc2lzLnNwZWFrKHV0dHIpO1xyXG4gICAgICAgICAgICB9KV07XHJcbiAgICB9KTtcclxufSk7IH07XHJcbi8vIOS9leOBi+OBl+OCiemAmuefpeOBl+OBn+OBhOOBk+OBqOOBjOOBguOBo+OBn+OCieihqOekuuOBmeOCi1xyXG5pcGNSZW5kZXJlci5vbihjb25zdF8xLmVsZWN0cm9uRXZlbnRbJ3Nob3ctYWxlcnQnXSwgZnVuY3Rpb24gKGV2ZW50LCBhcmdzKSB7IHJldHVybiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgIGFsZXJ0KGFyZ3MpO1xyXG4gICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcclxuICAgIH0pO1xyXG59KTsgfSk7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV2ZW50c1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm9zXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXJsXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV0aWxcIik7Il0sInNvdXJjZVJvb3QiOiIifQ==