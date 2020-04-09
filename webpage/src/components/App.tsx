import { observer } from 'mobx-react';
import * as React from 'react';

import { Info } from './Info';
import { GameFrame } from './GameFrame';
import { SelectRecordingForm } from './SelectRecordingForm';
import { useAppState } from '../stores/useAppState';
import { Notes } from './Notes';

export const App = observer(function App() {
	const appState = useAppState();

	return (
		<div id="container">
			<h1 className="logo">📼 TagPro VCR</h1>

			<header>
				<SelectRecordingForm />
			</header>

			{appState.started && <GameFrame />}

			{!appState.started && (
				<div className="info">
					<Info />
					<Notes />
				</div>
			)}
		</div>
	);
});
