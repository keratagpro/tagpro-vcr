import * as React from 'react';
import { render } from 'react-dom';

import { Recorder } from './components/Recorder';
import { GameContext } from './stores/GameContext';
import { GameState } from './stores/GameState';
import { BackgroundPlayer } from './utils/BackgroundPlayer';
import { EventedChannel } from './utils/EventedChannel';
import { FakeSocket } from './utils/FakeSocket';

const io = {
	connect() {
		const player = new BackgroundPlayer();
		window['player'] = player;

		// NOTE: For testing
		// player.worker.on('packet', (ts, type, data) => console.log(ts, type, data));
		// player.worker.on('end', ev => console.log('End!'));

		const socket = new FakeSocket(player);

		const channel = new EventedChannel('vcr');
		channel.emit('request-recording');

		channel.on('recording', (data) => {
			player.load(data);
			player.play();
		});

		// window['seek'] = function(to: number) {
		// 	const players = window.tagpro.players;
		// 	for (const id in players) {
		// 		if (players.hasOwnProperty(id)) {
		// 			players[id].lastSync = {};
		// 		}
		// 	}
		// 	player.seek(to);
		// };

		return socket;
	},
};

window['io'] = io;

// NOTE: Testing.
// io.connect();

const gameState = new GameState();

render(
	<GameContext.Provider value={gameState}>
		<Recorder />
	</GameContext.Provider>,
	document.getElementById('root')
);
