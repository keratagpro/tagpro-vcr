import { action, observable } from 'mobx';

export default class GameState {
	recorder: MediaRecorder;

	@observable
	recording = false;

	@action.bound
	toggleRecording() {
		if (this.recording) {
			this.stopRecording();
		} else {
			this.startRecording();
		}
	}

	@action.bound
	startRecording() {
		this.recording = true;

		const canvas = document.querySelector<HTMLCanvasElement>('#viewport');

		const stream = (canvas as any).captureStream();

		const recorder = new MediaRecorder(stream, {
			// videoBitsPerSecond: 10 * 1024 * 1024,
			mimeType: 'video/webm; codecs=vp9',
		});

		console.log(recorder);

		this.recorder = recorder;

		recorder.ondataavailable = handleDataAvailable;
		recorder.onstop = exportVideo;
		recorder.start();

		let chunks = [];
		function handleDataAvailable(ev: BlobEvent) {
			if (ev.data.size) {
				chunks.push(ev.data);
			}
		}

		function exportVideo() {
			const blob = new Blob(chunks, {
				type: 'video/webm',
			});

			downloadBlob(blob);
		}
	}

	@action.bound
	stopRecording() {
		this.recording = false;
		this.recorder.stop();
	}
}

function downloadBlob(blob: Blob) {
	const url = URL.createObjectURL(blob);
	downloadUrl(url, 'video.webm');
	URL.revokeObjectURL(url);
}

function downloadUrl(url: string, filename: string) {
	const a = document.createElement('a');
	document.body.appendChild(a);
	a.style.display = 'none';
	a.href = url;
	a.download = filename;
	a.click();
}
