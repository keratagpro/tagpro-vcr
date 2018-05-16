declare module '*.css';

interface CanvasCaptureMediaStreamTrack extends MediaStreamTrack {
	readonly canvas: HTMLCanvasElement;
	requestFrame(): void;
}

interface MediaRecorderOptions {
	mimeType?: string;
	audioBitsPerSecond?: number;
	videoBitsPerSecond?: number;
	bitsPerSecond?: number;
}

declare class MediaRecorder extends EventTarget {
	readonly stream: MediaStream;
	readonly mimeType: string;
	readonly state: 'inactive' | 'recording' | 'paused';
	readonly videoBitsPerSecond: number;
	readonly audioBitsPerSecond: number;

	constructor(stream: MediaStream, options?: MediaRecorderOptions);

	pause(): void;
	requestData(): void;
	resume(): void;
	start(timeslice?: number): void;
	stop(): void;

	static isTypeSupported(): boolean;
}
