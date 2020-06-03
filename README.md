# Actioneer
Handler of actions

## Install

`npm install git+https://github.com/rocket-boots/Actioneer.git#v0.2.1`

(Substitute the version number for the version of your choice)

## How to Use

```html
<button type="button" class="pause-button">Pause</button>
...
<div class="dpad">
	...
	<button type="button" class="dpad-right-button">Go Right</button>
	...
</div>
```

```js
import { Actioneer } from 'rocket-boots-actioneer';

// Setup the actioneer by providing it a configuration data object
const actionsByState = {
	// First level of property names are your states - name whatever you like
	main: {
		// Second level of properties are your actions
		runRight: {
			name: 'Run Right',
			keys: ['RIGHT'], // certain special names can be used to reference mulitple keys (e.g., 'd', right arrow)
			clickHolds: ['dpad-right-button'], // list of class names
			action: () => { /* some functionality to move */ }
		},
		pause: {
			name: 'Pause',
			keys: ['p'],
			clicks: ['pause-button'],
			action: () => actioneer.setState('paused')
			// Switching state will make sure that only the actions from that state are being triggered
		}
	},
	paused: {
		resume: {
			name: 'Unpause',
			keys: ['p', 'ESC', 'ENTER'],
			action: () => actioneer.setState('main')
		}
	}
};

const options = { // Not in use yet
	// useTaps: true,
	// useWasdKeys: true,
	// useWasdDiagonalKeys: false,
	// useViKeys: true,
	// useViDiagonalKeys: false
};

const actioneer = new Actioneer(actionsByState, options);

actioneer.setState('main');
```
