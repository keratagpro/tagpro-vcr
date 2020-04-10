import { observer } from 'mobx-react';
import * as React from 'react';

import { Dialog } from '../elements/Dialog';
import { useAppState } from '../stores/useAppState';

export const SettingsDialog = observer(function SettingsDialog() {
	const appState = useAppState();

	return (
		<Dialog open={appState.showSettings} onClose={() => appState.toggleSettings(false)}>
			<h2>Settings</h2>
			<hr />

			<label>
				<input type="checkbox" checked={appState.theme === 'light'} onChange={appState.toggleLightTheme} /> Use
				light theme
			</label>
		</Dialog>
	);
});
