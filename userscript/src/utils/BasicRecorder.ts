export class BasicRecorder {
	started = false;
	firstPacketTime: number;
	packets: string[] = [];

	record(time: number, type: string, ...args: any[]) {
		if (!this.started) {
			this.started = true;
			this.firstPacketTime = time;
		}

		// NOTE: Have to stringify, since the TagPro game modifies the packets and adds circular references.
		this.packets.push(JSON.stringify([time - this.firstPacketTime, type, ...args]));
	}

	end() {
		return Promise.resolve(this.packets.join('\n'));
	}
}
