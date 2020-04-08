import * as React from 'react';
import { observer } from 'mobx-react';
import useGameState from '../stores/useGameState';
import * as classNames from 'classnames';

export default observer(function Recorder() {
	const gameState = useGameState();

	return (
		<div className="recorder">
			<button onClick={gameState.toggleRecording}>
				<span className={classNames({ recording: gameState.recording })}>🔴</span> Record
			</button>
		</div>
	);
});
