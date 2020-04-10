import * as classNames from 'classnames';
import { observer } from 'mobx-react';
import * as React from 'react';

import { useGameState } from '../stores/useGameState';
import { GlobalStyle } from './GlobalStyle';

export const Recorder = observer(function Recorder() {
	const gameState = useGameState();

	return (
		<div className="recorder">
			<GlobalStyle />
			<button onClick={gameState.toggleRecording}>
				<span className={classNames({ recording: gameState.recording })}>🔴</span> Record
			</button>
		</div>
	);
});
