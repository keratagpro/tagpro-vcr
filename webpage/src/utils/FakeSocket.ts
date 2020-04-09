import { BackgroundPlayer } from './BackgroundPlayer';

export class FakeSocket {
	constructor(public player: BackgroundPlayer) {}

	on(type, listener) {
		this.player.on(type, listener);
	}

	emit(type, data) {
		// this.player.worker.emit(type, data);
	}

	removeListener(type, listener) {
		this.player.removeListener(type, listener);
	}

	// NOTE: Fake io object
	get io() {
		return {
			engine: {
				transport: {
					polling: false,
				},
			},
		};
	}
}
