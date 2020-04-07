import { observer } from 'mobx-react';
import * as React from 'react';

import useAppState from '../stores/useAppState';

export default observer(function StartButton() {
	const appState = useAppState();

	return (
		<button disabled={appState.started || !appState.recording} onClick={appState.handleStart}>
			▶ Start
		</button>
	);
});
