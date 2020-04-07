import * as EventEmitter from 'eventemitter3';

export default class EventedChannel extends BroadcastChannel {
	events: EventEmitter;

	constructor(name: string) {
		super(name);

		const events = (this.events = new EventEmitter());

		this.addEventListener('message', (ev) => {
			const [type, ...args] = ev.data;
			events.emit(type, ...args);
		});
	}

	on(event: string, listener: EventEmitter.ListenerFn) {
		this.events.on(event, listener);
	}

	emit<T>(type: string, data?: T) {
		this.postMessage([type, data]);
	}
}
