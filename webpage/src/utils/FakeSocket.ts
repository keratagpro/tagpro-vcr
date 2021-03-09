import BackgroundPlayer from './BackgroundPlayer';

export default class FakeSocket {
	constructor(public player: BackgroundPlayer) {
	}

	on(type, listener) {
		this.player.on(type, listener);
	}

	emit(type, data) {
		// this.player.worker.emit(type, data);
	}

	prependListener(type, listener) {
		const listeners = this.player.listeners(type);
		this.player.removeAllListeners(type);

		this.player.on(type, listener);
		listeners.forEach(l => this.player.on(type, l));
	}

	removeListener(type, listener) {
		this.player.removeListener(type, listener);
	}

	// NOTE: Fake io object
	get io() {
		return {
			engine: {
				transport: {
					polling: false
				}
			}
		};
	}
}
