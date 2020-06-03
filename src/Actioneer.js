import KeyboardListener from './KeyboardListener.js';
// import ClickListener from './ClickListener.js';

const UNSPECIFIED_STATE = 'UNSPECIFIED';
const MOUSE_DOWN_INTERVAL_TIME = 35; // milliseconds; this feel right

class Actioneer {
	constructor(actionsByState = {}, options = {}) {
		this.state = UNSPECIFIED_STATE;
		this.actionsByState = actionsByState;
		this.keyboard = new KeyboardListener();
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
		const key = Actioneer.getClickCallbackKey(clickClass, this.state);
		return this.clickCallbacks[key];
	}

	setClickCallback(stateName, clickClass, callback) {
		const key = Actioneer.getClickCallbackKey(clickClass, stateName);
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
				const key = Actioneer.getClickCallbackKey(className, this.state);
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
			const clicks = Actioneer.getActionInfoArray(actionInfo, 'clicks');
			const clickHolds = Actioneer.getActionInfoArray(actionInfo, 'clickHolds');
			clicks.forEach((click) => {
				this.setClickCallback(stateName, click, actionInfo.action);
			});
			clickHolds.forEach((click) => {
				this.setClickCallback(stateName, click, actionInfo.action);
				const key = Actioneer.getClickCallbackKey(click, stateName);
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

export default Actioneer;
