import * as classNames from 'classnames';
import { observer } from 'mobx-react';
import * as React from 'react';

import { useGameState } from '../stores/useGameState';

export const Recorder = observer(function Recorder() {
	const gameState = useGameState();

	return (
		<div className="recorder">
			<button onClick={gameState.toggleRecording}>
				<span className={classNames({ recording: gameState.recording })}>🔴</span> Record
			</button>
		</div>
	);
});
