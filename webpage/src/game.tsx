import BackgroundPlayer from './utils/BackgroundPlayer';
import EventedChannel from './utils/EventedChannel';
import FakeSocket from './utils/FakeSocket';

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

		channel.on('recording', data => {
			player.load(data);
			player.play();
		});

		window['seek'] = function(to: number) {
			player.pause();

			window['restore_sound'] = window.tagpro.sound;
			window.tagpro.sound = false;

			window.tagpro.gameEndsAt = null;
			window.tagpro.overtimeStartedAt = null;

			const players = window.tagpro.players;
			for (const id in players) {
				if (players.hasOwnProperty(id)) {
					players[id].lastSync = {};
					if (Number(id) !== window.tagpro.playerId) {
						player.emit("playerLeft", id);
					}
				}
			}

			for (let i = 0; i < 10; i++) {
				player.emit("chat", { from: null, to: "all", message: "\xa0" });
			}

			player.seek(to);
			player.play();
		};

		return socket;
	}
};

window['io'] = io;

// NOTE: Testing.
// io.connect();
