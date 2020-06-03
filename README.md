# Actioneer
Handler of actions

## Install

`npm install git+https://github.com/rocket-boots/Actioneer.git#v0.2.0`

(Substitute the version number for the version of your choice)

## How to Use

```js
const actionsByState = {
	// First level of property names are your states - name whatever you like
	main: {
		// Second level of properties are your actions
		runRight: {
			name: 'Run Right',
			keys: ['RIGHT'],
			clickHolds: ['dpad-right-button'],
			action: () => { /* some functionality to move */ }
		},
		pause: {
			name: 'Pause',
			keys: ['p'],
			clicks: ['pauseButtonClassName'],
			action: () => actioneer.setState('paused')
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
