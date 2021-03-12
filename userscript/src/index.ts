import tagpro from 'tagpro';

import * as utils from './utils';
import BasicRecorder from './utils/BasicRecorder';
import { GameStorage, VcrGame } from './utils/GameStorage';
import { isInGame, isTopLevelPage, readyAsync } from './utils/tagpro';
import VcrSettings from './utils/VcrSettings';
import VcrWindow from './utils/VcrWindow';

function debug(...args) {
	console.log("TagPro VCR:", ...args);
}

const settings = new VcrSettings();
let storage: GameStorage;
if (!settings.download) {
	storage = new GameStorage(settings.save);
}

const vcrWindow = new VcrWindow(settings, storage);

(async function() {
	await readyAsync(tagpro);

	if (isInGame(tagpro) && settings.enabled) {
		debug('Recording.');
		startRecording(tagpro);
	} else if (isTopLevelPage()) {
		debug('Injecting link to VCR.');
		vcrWindow.addVcrLink();
		vcrWindow.showVcrWelcomeIfNeeded();
	} else {
		debug('Not in game.');
	}
})();

function startRecording(tp: TagPro) {
	const recorder = new BasicRecorder();
	let start = new Date();

	const game: VcrGame = {
		timestamp: start.valueOf(),
		start: utils.dateToString(start),
		map: 'Unknown',
		group: false,
		duration: 0,
		team: 'Unknown',
		name: 'Unknown',
		winner: false,
		data: ''
	};

	const teams = {
		red: "Red",
		blue: "Blue"
	};

	const metadata = {
		server: location.hostname,
		port: location.port,
		time: start.valueOf(),
		tagproVersion: tp.version
	};

	const getPlayer = () => {
		if (tp.playerId && !tp.spectator) {
			return tp.players[tp.playerId];
		}

		return undefined;
	};

	recorder.record(utils.now(), 'recorder-metadata', metadata);

	// NOTE: removing $ prefix.
	const events = Object.keys(tp.rawSocket['_callbacks']).map(e => (e.startsWith('$') ? e.substr(1) : e));

	const listeners = utils.addPacketListeners(tp.rawSocket, events, recorder.record.bind(recorder));

	tp.rawSocket.on('time', (e) => {
		if (e.state === 1) {
			start = new Date();
		}
	});

	tp.rawSocket.on('map', (e) => {
		game.map = e.info.name;
	});

	tp.rawSocket.on('spectator', (e) => {
		game.name = '[Spectator]';
		game.team = 'Spectator';
	});

	tp.rawSocket.on('groupId', (e) => {
		game.group = (e !== null);
	})

	tp.rawSocket.on('teamNames', (e) => {
		teams.red = e.redTeamName;
		teams.blue = e.blueTeamName;
	});

	tp.rawSocket.on('p', (e) => {
		const me = getPlayer();
		if (me) {
			game.name = me.name;
			game.team = me.team === 1 ? teams.red : me.team === 2 ? teams.blue : "Unknown";
		}
	});

	tp.rawSocket.on('end', (e) => {
		game.duration = utils.now() - start.valueOf();

		const me = getPlayer();
		if (me) {
			game.winner = (me.team === 1 && e.winner === "red") || (me.team === 2 && e.winner === "blue");
		}
	});

	window.addEventListener('beforeunload', async function(ev) {
		const end = utils.now();
		game.duration ||= end - start.valueOf();

		debug('Getting ready to save');

		listeners.cancel();
		recorder.record(end, 'recorder-summary', game);

		const data = await recorder.end();

		if (settings.skipSpectator && (game.team === 'Spectator')) {
			return;
		}

		if (settings.skipShort && (game.duration < (settings.shortSeconds * 1000))) {
			return;
		}

		if (settings.download) {
			const timestamp = utils.dateToString(start, true);
			utils.saveFile(data, `tagpro-recording-${timestamp}.ndjson`);
		} else {
			game.data = data;
			storage.saveGame(game.timestamp, game);
		}
	});
}
