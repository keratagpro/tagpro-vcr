import { observer } from 'mobx-react';
import * as React from 'react';

import { Button } from '../elements/Button';
import { useAppState } from '../stores/useAppState';

export const SettingsButton = observer(function SettingsButton() {
	const appState = useAppState();

	return (
		<Button onClick={() => appState.toggleSettings()} title="Settings">
			⚙️
		</Button>
	);
});
