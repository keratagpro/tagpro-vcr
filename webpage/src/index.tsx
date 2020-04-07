import * as React from 'react';
import { render } from 'react-dom';

import App from './components/App';
import AppState from './stores/AppState';
import AppContext from './stores/AppContext';

const appState = new AppState();

// NOTE: For testing
window['appState'] = appState;

render(
	<AppContext.Provider value={appState}>
		<App />
	</AppContext.Provider>,
	document.getElementById('root')
);
