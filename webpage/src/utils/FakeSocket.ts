import BackgroundPlayer from './BackgroundPlayer';

export default class FakeSocket {
	constructor(public player: BackgroundPlayer, public onEmit?: (type: string, data: any) => void) {
	}

	on(type, listener) {
		this.player.on(type, listener);
	}

	emit(type, data) {
		if (this.onEmit) {
			this.onEmit(type, data);
		}

		// this.player.worker.emit(type, data);
	}

	listeners(type) {
		return this.player.listeners(type);
	}

	prependListener(type, listener) {
		this.listeners(type).unshift(listener);
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
