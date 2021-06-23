const now = performance.now.bind(performance);

// NOTE: Minimum interval in browsers is 4ms.
const DEFAULT_INTERVAL = 4;

export type Packet = [
	number,
	string,
	any
];

export default class PacketDataPlayer {
	loopId;
	currentIndex: number;
	currentTime = 0;
	scheduledPacket: Packet;
	paused = false;
	startedAt: number;

	constructor(
		public packets: Packet[],
		public callback: (ts: number, type: string, data?: any) => void,
		public seekCallback: (to: number) => void = () => {},
		public doneCallback = () => {}
	) {
		this.currentIndex = 0;
	}

	seek(to: number) {
		const event = { ts: 0, time: 0, state: 0 };

		for (let index = 0; index < this.packets.length; index++) {
			const packet = this.packets[index];
			const nextPacket = this.packets[index + 1];

			if (packet[1] === "time") {
				event.ts = packet[0];
				event.time = packet[2].time;
				event.state = packet[2].state;
			}

			this.callback(packet[0], packet[1], packet[2]);

			if (nextPacket && nextPacket[0] > to) {
				const offset = packet[0] - event.ts;
				const newtime = (event.state === TagPro.State.Overtime) ? event.time + offset : event.time - offset;

				this.callback(packet[0], "time", { time: newtime, state: event.state });

				this.currentTime = packet[0];
				this.startedAt = now() - this.currentTime;
				this.currentIndex = index + 1;
				this.scheduledPacket = nextPacket;

				break;
			}
		}

		this.seekCallback(this.currentTime);
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
		if (this.paused) {
			return;
		}

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

		this.callback(packet[0], packet[1], packet[2]);
		this.currentIndex++;
		this.scheduledPacket = this.packets[this.currentIndex];
	};
}
