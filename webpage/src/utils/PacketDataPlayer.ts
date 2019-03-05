const now = performance.now.bind(performance);

// NOTE: Minimum interval in browsers is 4ms.
const DEFAULT_INTERVAL = 4;

export default class PacketDataPlayer {
	loopId;
	currentIndex: number;
	currentTime = 0;
	scheduledPacket: [number, string, any];
	paused = false;
	startedAt: number;
	duration: number;

	constructor(
		public packets: Array<[number, string, any]>,
		public callback: (ts: number, type: string, data?: any) => void,
		public doneCallback = () => {}
	) {
		this.currentIndex = 0;
		this.duration = packets[packets.length - 1][0];
	}

	seek(to: number) {
		let index = this.packets.findIndex(([ts]) => ts < to);
		let packet = this.packets[index];

		let event = { ts: 0, time: 0, state: 0 };

		while (packet) {
			packet = this.packets[++index];

			this.currentTime = packet[0];

			if (packet[1] == "time") {
				event.ts = packet[0];
				event.time = packet[2].time;
				event.state = packet[2].state;
			}

			if (packet[0] > to) {
				let offset = packet[0] - event.ts;
				let newtime = event.state == 5 ? event.time + offset : event.time - offset;

				this.callback(packet[0], "time", { time: newtime, state: event.state, restore: true });

				this.startedAt = now() - packet[0];
				this.currentIndex = index;
				this.scheduledPacket = packet;

				break;
			}

			this.callback(packet[0], packet[1], packet[2]);
		}
	}

	play(interval = DEFAULT_INTERVAL) {
		if (this.paused) {
			this.paused = false;
			this.startedAt = now() - this.currentTime;
		} else {
			this.startedAt = now();
		}

		this.scheduledPacket = this.packets[this.currentIndex];

		this.loopId = setInterval(this._loop, interval);
	}

	pause() {
		this.paused = true;
		clearInterval(this.loopId);
	}

	_loop = () => {
		this.currentTime = now() - this.startedAt;

		const packet = this.scheduledPacket;

		if (!packet) {
			this.pause();
			this.doneCallback();
			return;
		}

		if (this.currentTime < packet[0]) {
			return;
		}

		if (packet[1] == "connect") {
			let index = this.packets.findIndex(p => p[1] == "end");
			let endPacket = this.packets[index];

			packet[2] = packet[2] || {};
			packet[2].duration = endPacket[0];
		}

		this.callback(packet[0], packet[1], packet[2]);
		this.currentIndex++;
		this.scheduledPacket = this.packets[this.currentIndex];
	};
}
