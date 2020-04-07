import { observer } from 'mobx-react';
import * as React from 'react';

import useAppState from '../stores/useAppState';

export default observer(function StopButton() {
	const appState = useAppState();

	return (
		<button className="stop" disabled={!appState.started} onClick={appState.handleStop}>
			■ Stop
		</button>
	);
});
