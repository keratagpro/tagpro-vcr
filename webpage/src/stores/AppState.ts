import { action, computed, extendObservable, observable, observe, reaction } from 'mobx';

import { equals } from '../utils';
import EventedChannel from '../utils/EventedChannel';

export class AppState {
	channel: EventedChannel;

	@observable recording = localStorage.getItem('recording');
	@observable recordingName = localStorage.getItem('recordingName');

	@observable selectedFile: File = undefined;
	@observable started = false;
	@observable infoShown = !localStorage.getItem('recordingName');

	constructor() {
		const channel = (this.channel = new EventedChannel('vcr'));

		channel.on('request-recording', () => {
			channel.emit('recording', parseRecording(this.recording));
		});

		reaction(
			() => this.selectedFile,
			file => {
				if (!file) {
					this.recordingName = undefined;
					this.recording = undefined;
					return;
				}

				const reader = new FileReader();

				reader.addEventListener('load', () => {
					this.recordingName = file.name;
					this.recording = reader.result;
				});

				reader.readAsText(file);
			}
		);

		reaction(() => this.recording, localStore(this, 'recording'));
		reaction(() => this.recordingName, localStore(this, 'recordingName'));
	}

	@action.bound
	handleFileSelect(ev: React.ChangeEvent<HTMLInputElement>) {
		this.selectedFile = ev.target.files[0];
	}

	@action.bound
	handleStart() {
		if (!this.recording) {
			return;
		}

		this.started = true;
	}

	@action.bound
	handleStop() {
		this.started = false;
	}

	@action.bound
	showInfo() {
		this.infoShown = true;
	}

	@action.bound
	hideInfo() {
		this.infoShown = false;
	}
}

function parseRecording(data: string) {
	return data
		.split('\n')
		.filter(l => l.trim().length > 0)
		.map(line => JSON.parse(line));
}

function localStore<T>(target: T, key: keyof T) {
	return function() {
		if (target[key]) {
			// console.log('setting', key);
			localStorage.setItem(key, String(target[key]));
		} else {
			// console.log('removing', key);
			localStorage.removeItem(key);
		}
	};
}
