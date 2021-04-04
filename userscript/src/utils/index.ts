type PacketCallback = (time: number, type: string, ...args: any[]) => void;

export const now = () => Date.now();

export function dateToString(d: Date, filename: boolean = false) {
	const dash = filename ? "" : "-";
	const space = filename ? "" : " ";
	const colon = filename ? "" : ":";

	let str =
		d.getFullYear() + dash +
		("0" + (d.getMonth() + 1)).slice(-2) + dash +
		("0" + d.getDate()).slice(-2) + space +
		("0" + d.getHours()).slice(-2) + colon +
		("0" + d.getMinutes()).slice(-2);

	if (filename) {
		str += ("0" + d.getSeconds()).slice(-2);
	}

	return str;
}

export function addPacketListeners(socket: SocketIO.Socket, events: string[], onPacket: PacketCallback) {
	const packetListeners = new Map<string, (...args: any[]) => void>();

	for (const type of events) {
		const cb = function(data?: any) {
			onPacket(now(), type, data);
		};

		packetListeners.set(type, cb);
		socket.on(type, cb);
	}

	function cancel() {
		for (const [type, callback] of packetListeners) {
			socket.removeListener(type, callback);
		}
		packetListeners.clear();
	}

	return { cancel };
}

export function saveFile(data: any, filename: string, type = 'application/x-ndjson') {
	const blob = new Blob([data], { type });
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();

	// window.open(url, '_blank');

	URL.revokeObjectURL(url);
}
