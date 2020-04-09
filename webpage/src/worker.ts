import * as EventEmitter from 'eventemitter3';

import { PacketDataPlayer } from './utils/PacketDataPlayer';

declare var self: DedicatedWorkerGlobalScope;

const worker = self;
const events = new EventEmitter();

worker.addEventListener('message', function (ev) {
	const [type, ...args] = ev.data;
	events.emit(type, ...args);
});

let player: PacketDataPlayer;

events.on('load', function (replay: Array<[number, string, any]>) {
	if (player) {
		player.pause();
	}

	player = new PacketDataPlayer(
		replay,
		function (ts, type, data) {
			emit('packet', ts, type, data);
		},
		function () {
			emit('end');
		}
	);
});

events.on('play', function () {
	if (player) {
		player.play();
	}
});

events.on('pause', function () {
	if (player) {
		player.pause();
	}
});

events.on('seek', function (to: number) {
	if (player) {
		player.fastForward(to);
	}
});

function emit(type: string, ...args: any[]) {
	worker.postMessage([type, ...args]);
}
