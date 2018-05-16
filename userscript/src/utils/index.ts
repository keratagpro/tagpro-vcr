type PacketCallback = (time: number, type: string, ...args: any[]) => void;

export const now = () => Date.now();

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

export function addLinkToVcr() {
	const li = document.createElement('li');
	const link = document.createElement('a');

	link.href = 'VCR_URL';
	link.target = '_blank';
	link.innerText = 'VCR';

	li.appendChild(link);

	const nav = document.querySelector('#site-nav > ul');
	nav.appendChild(li);
}
