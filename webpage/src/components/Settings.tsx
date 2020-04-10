import { observer } from 'mobx-react';
import * as React from 'react';

import { useAppState } from '../stores/useAppState';
import { Dialog } from './Dialog';

export const Settings = observer(function Settings() {
	const appState = useAppState();

	return (
		<Dialog open={appState.showSettings} onClose={() => appState.toggleSettings(false)}>
			<h1>Settings</h1>
			<hr />
			...
		</Dialog>
	);
});
