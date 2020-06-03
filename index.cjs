(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

// TODO: incorporate functionality from Lunar's Input.js
// TODO: Move to its own library
// TODO: Bring into rote js

const ANY = 'ANY';
const DIRECTION8 = {
	'UP': 0, 'UP-RIGHT': 1,
	'RIGHT': 2, 'DOWN-RIGHT': 3,
	'DOWN': 4, 'DOWN-LEFT': 5,
	'LEFT': 6, 'UP-LEFT': 7
};
const DIRECTION4 = { 'UP': 0, 'RIGHT': 1, 'DOWN': 2, 'LEFT': 3 };
const DIRECTION4_ARRAY = ['UP', 'RIGHT', 'DOWN', 'LEFT'];

const USED_KEYS = [
	'i', 't', 'o', 'p', '1', '2', '3', '4', '5', '6', '7', '8', '9',
	'm'
];
const KEY_MAP = {
	"9":	"TAB",
	"13":	"ENTER",
	"27":	"ESC",
	"32":	"SPACE",
};
KEY_MAP[38] = 'UP'; // up
KEY_MAP[33] = 'UP-RIGHT';
KEY_MAP[39] = 'RIGHT'; // right
KEY_MAP[34] = 'DOWN-RIGHT';
KEY_MAP[40] = 'DOWN'; // down
KEY_MAP[35] = 'DOWN-LEFT';
KEY_MAP[37] = 'LEFT'; // left
KEY_MAP[36] = 'UP-LEFT';

const WASD_KEYMAP = {
	87: 'UP', // w
	65: 'LEFT', // a
	83: 'DOWN', // s
	68: 'RIGHT', // d
};
const WASD_DIAGONAL = {
	...WASD_KEYMAP,
	81: 'UP-LEFT', // q
	69: 'UP-RIGHT', // e
	90: 'DOWN-LEFT', // z
	67: 'DOWN-RIGHT', // c
};
const VI_KEYMAP = {
	72: 'LEFT', // h
	74: 'DOWN', // j
	75: 'UP', // k
	76: 'RIGHT', // l
};
const VI_DIAGONAL = {
	...VI_KEYMAP,
	89: 'UP-LEFT', // y
	85: 'UP-RIGHT', // u
	66: 'DOWN-LEFT', // b
	78: 'DOWN-RIGHT', // n
};

const UNSPECIFIED_STATE = 'UNSPECIFIED';

class KeyboardListener {
	constructor(options = {}) {
		this.callbacks = {};
		this.isListening = false;
		this.state = options.state || UNSPECIFIED_STATE;
		this.autoStart = (options.autoStart === undefined) ? false : Boolean(options.autoStart);
	}

	setState(state = UNSPECIFIED_STATE) {
		this.state = state.toString();
	}

	on(state, key, callback) {
		// key can be a keyCode or a keyType like 'DIRECTION'
		this.callbacks[state + '_' + key] = callback;
		if (this.autoStart) {
			this.start();
		}
	}
	
	off(state, key, callback) {
		// TODO: remove callback
		// TODO: if no more callbacks then stop
	}

	getKeyMap() {
		let keyMap = { ...KEY_MAP };
		// TODO: variations based on options selected
		keyMap = { ...keyMap, ...WASD_DIAGONAL, ...VI_DIAGONAL };
		return keyMap;
	}

	handleEvent(e) {
		const keyMap = this.getKeyMap();
		const { keyCode, key } = e;
		const isKeyUsed = USED_KEYS.includes(key) || (keyCode in keyMap);

		if (!isKeyUsed) {
			console.log('Keyboard handleEvent - unaccounted for key:', key, keyCode);
			return;
		}
		e.preventDefault();

		// Lookup key name and direction
		const keyName = keyMap[keyCode] || key;
		const direction = DIRECTION8[keyName];
		// console.log('handleEvent', e, keyName, keyCode, direction);

		// Callbacks
		if (direction !== undefined) {
			const typeCallback = this.callbacks[this.state + '_DIRECTION'];
			if (typeCallback) {
				typeCallback(keyName, keyCode, direction);
			}
		}
		const callback = this.callbacks[this.state + '_' + keyName];
		// console.log(this.state + '_' + keyName, callback);
		if (callback) {
			callback(keyName, keyCode, direction);
		} else {
			const anyCallback = this.callbacks[this.state + '_' + ANY];
			if (anyCallback) {
				anyCallback(keyName, keyCode, direction);
			}
		}
	}

	start() {
		if (this.isListening) {
			return;
		}
		window.addEventListener('keydown', this);  // pass this; the `handleEvent` will be used
		this.isListening = true;
	}

	stop() {
		// TODO: remove event listener
	}
}

module.exports = KeyboardListener;


/***/ }),
/* 1 */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./src/KeyboardListener.js
var KeyboardListener = __webpack_require__(0);
var KeyboardListener_default = /*#__PURE__*/__webpack_require__.n(KeyboardListener);

// CONCATENATED MODULE: ./src/Actioneer.js

// import ClickListener from './ClickListener.js';

const UNSPECIFIED_STATE = 'UNSPECIFIED';
const MOUSE_DOWN_INTERVAL_TIME = 35; // milliseconds; this feel right

class Actioneer_Actioneer {
	constructor(actionsByState = {}, options = {}) {
		this.state = UNSPECIFIED_STATE;
		this.actionsByState = actionsByState;
		this.keyboard = new KeyboardListener_default.a();
		this.clickCallbacks = {};
		this.clickHolds = new Set();
		this.setupKeyboard();
		this.setupClicks();
		this.setState();
		console.log('actioneer options', options);
	}

	setState(stateName = UNSPECIFIED_STATE) {
		this.state = String(stateName);
		this.keyboard.setState(stateName);
	}

	doAction(actionName) {
		this.getActionInfo(this.state, actionName).action();
	}

	getActionInfo(stateName, actionName) {
		return this.actionsByState[stateName][actionName];
	}

	loopOverActions(fn) {
		Object.keys(this.actionsByState).forEach((stateName) => {
			const actions = this.actionsByState[stateName];
			Object.keys(actions).forEach((actionName) => {
				const actionInfo = this.getActionInfo(stateName, actionName);
				fn(actionInfo, actionName, stateName);
			});
		});
	}

	setupKeyboard() {
		this.loopOverActions((actionInfo, actionName, stateName) => {
			if (!actionInfo.keys || !actionInfo.action) { return; }
			const keys = (typeof actionInfo.keys === 'string') ? [actionInfo.keys] : actionInfo.keys;
			keys.forEach((key) => {
				this.keyboard.on(stateName, key, () => actionInfo.action());
			});
		});
		this.keyboard.start();
	}

	static getClickCallbackKey(clickName, stateName) {
		return stateName + '_' + clickName;
	}

	getClickCallback(clickClass) {
		const key = Actioneer_Actioneer.getClickCallbackKey(clickClass, this.state);
		return this.clickCallbacks[key];
	}

	setClickCallback(stateName, clickClass, callback) {
		const key = Actioneer_Actioneer.getClickCallbackKey(clickClass, stateName);
		this.clickCallbacks[key] = callback;
	}

	setupClicks() {
		this.populateClickCallback();
		if (Object.keys(this.clickCallbacks).length === 0) { return; } // no need to listen

		// TODO: this could be made more efficient?
		let clickTimer = null;
		// TODO: include a way to remove the listener as well
		const onClickDown = (e) => {
			e.target.classList.forEach((className) => {
				console.log(className);
				const fn = this.getClickCallback(className);
				if (!fn) { return; }
				const key = Actioneer_Actioneer.getClickCallbackKey(className, this.state);
				if (this.clickHolds.has(key)) {
					clickTimer = window.setInterval(fn, MOUSE_DOWN_INTERVAL_TIME);
				} else {
					fn();
				}
				e.preventDefault();
			});
		};
		const onClickUp = (e) => {
			if (clickTimer) {
				window.clearInterval(clickTimer);
				e.preventDefault();
				clickTimer = null;
			}
		};

		const options = { passive: false };
		document.addEventListener('mousedown', (e) => onClickDown(e), options);
		document.addEventListener('mouseup', (e) => onClickUp(e), options);
		document.addEventListener('touchstart', (e) => onClickDown(e), options);
		document.addEventListener('touchend', (e) => onClickUp(e), options);
	}

	populateClickCallback() {
		this.loopOverActions((actionInfo, actionName, stateName) => {
			if (!actionInfo.action) { return; }
			const clicks = Actioneer_Actioneer.getActionInfoArray(actionInfo, 'clicks');
			const clickHolds = Actioneer_Actioneer.getActionInfoArray(actionInfo, 'clickHolds');
			clicks.forEach((click) => {
				this.setClickCallback(stateName, click, actionInfo.action);
			});
			clickHolds.forEach((click) => {
				this.setClickCallback(stateName, click, actionInfo.action);
				const key = Actioneer_Actioneer.getClickCallbackKey(click, stateName);
				this.clickHolds.add(key);
			});
		});
	}

	static getActionInfoArray(actionInfo = {}, name) {
		if (actionInfo[name] === undefined) { return []; }
		if (actionInfo[name] === 'string') { return [actionInfo[name]]; }
		return actionInfo[name];
	}
}

/* harmony default export */ var src_Actioneer = (Actioneer_Actioneer);

// CONCATENATED MODULE: ./index.mjs



/* harmony default export */ var index = __webpack_exports__["default"] = ({ Actioneer: src_Actioneer, KeyboardListener: KeyboardListener });


/***/ })
/******/ ])["default"]));