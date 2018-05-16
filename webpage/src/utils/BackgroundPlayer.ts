import EventEmitter, { ListenerFn } from 'eventemitter3';

import EventedWorker from './EventedWorker';

export default class BackgroundPlayer extends EventEmitter {
	worker: EventedWorker;

	constructor(stringUrl = 'worker.js') {
		super();

		this.worker = new EventedWorker(stringUrl);

		this.worker.on('packet', (ts: number, type: string, ...args: any[]) => {
			this.emit(type, ...args);
		});
	}

	load(data: any) {
		this.worker.emit('load', data);
	}

	play() {
		this.worker.emit('play');
	}

	seek(to: number) {
		this.worker.emit('seek', to);
	}

	pause() {
		this.worker.emit('pause');
	}
}
