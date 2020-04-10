import { observer } from 'mobx-react';
import * as React from 'react';

import { useAppState } from '../stores/useAppState';
import { GameFrame } from './GameFrame';
import { GlobalStyle } from './GlobalStyle';
import { Header } from './Header';
import { Info } from './Info';
import { Notes } from './Notes';

export const App = observer(function App() {
	const appState = useAppState();

	return (
		<div id="container">
			<GlobalStyle />

			<h1 className="logo">📼 TagPro VCR</h1>

			<Header />

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
