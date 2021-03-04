import { stringify } from './stringify';

export default class BasicRecorder {
	started = false;
	firstPacketTime: number;
	packets: string[] = [];

	record(time: number, type: string, ...args: any[]) {
		if (!this.started) {
			this.started = true;
			this.firstPacketTime = time;
		}

		// NOTE: Have to stringify, since the TagPro game modifies the packets and adds circular references.
		const packet = stringify([time - this.firstPacketTime, type, ...args], type === 'p');
		this.packets.push(packet);
	}

	end() {
		return Promise.resolve(this.packets.join('\n'));
	}
}
