import * as React from 'react';

export default function GameFrame() {
	return (
		<div id="game-container">
			<iframe id="game-frame" src="game.html" frameBorder="0" />
		</div>
	);
}
