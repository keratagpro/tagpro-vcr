const now = performance.now.bind(performance);

// NOTE: Minimum interval in browsers is 4ms.
const DEFAULT_INTERVAL = 4;

export class PacketDataPlayer {
	loopId;
	currentIndex: number;
	currentTime = 0;
	scheduledPacket: [number, string, unknown];
	paused = false;
	startedAt: number;
	duration: number;

	constructor(
		public packets: Array<[number, string, unknown]>,
		public callback: (ts: number, type: string, data?: unknown) => void,
		public doneCallback = () => {}
	) {
		this.currentIndex = 0;
		this.duration = packets[packets.length - 1][0];
	}

	seek(to: number) {
		this.startedAt = now() - to;
		this.currentIndex = this.packets.findIndex(([ts]) => ts > to);
		this.scheduledPacket = this.packets[this.currentIndex];
	}

	advance(to: number) {
		// const index = this.packets.findIndex(([ts]) => ts < to);

		while (this.scheduledPacket) {
			const packet = this.packets[this.currentIndex++];
			this.scheduledPacket = packet;

			if (packet[0] > to) {
				break;
			}

			this.callback(packet[0], packet[1], packet[2]);
		}
	}

	fastForward(to: number, from = 0) {
		let index = to < from ? 0 : this.packets.findIndex(([ts]) => ts >= from && ts < to);
		let packet = this.packets[index];

		while (packet) {
			packet = this.packets[++index];

			this.currentTime = packet[0];

			if (packet[0] > to) {
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

		this.callback(packet[0], packet[1], packet[2]);
		this.currentIndex++;
		this.scheduledPacket = this.packets[this.currentIndex];
	};
}
