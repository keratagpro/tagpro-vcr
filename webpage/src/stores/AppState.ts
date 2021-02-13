import { action, computed, extendObservable, observable, observe, reaction } from 'mobx';

import { equals } from '../utils';
import EventedChannel from '../utils/EventedChannel';

export class AppState {
	channel: EventedChannel;

	@observable recording = localStorage.getItem('recording');
	@observable recordingName = localStorage.getItem('recordingName');
	@observable recordingURL = '';

	@observable selectedFile: File = undefined;
	@observable started = false;
	@observable fetching = false;
	@observable urlIsValid = undefined;

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

		reaction(
			() => this.recordingURL,
			url => {
				if (!this.recordingURL) {
					return;
				}

				this.fetching = true;

				fetch(url)
					.then(r => {
						if (!r.ok) {
							throw r;
						} else {
							return r.text();
						}
					})
					.then(text => {
						this.recording = text;
						this.fetching = false;
						this.urlIsValid = true;
					})
					.catch(err => {
						this.recording = undefined;
						this.fetching = false;
						this.urlIsValid = false;
					});
			},
			{
				delay: 1000
			}
		);

		reaction(() => this.recording, localStore(this, 'recording'));
		reaction(() => this.recordingName, localStore(this, 'recordingName'));
	}

	isEggBall() {
		return this.recording
			.split('\n')
			.filter(l => l.match(/^\[\d+,"eggBall",/))
			.length > 0
	}

	@action.bound
	handleFileSelect(ev: React.ChangeEvent<HTMLInputElement>) {
		this.recordingURL = '';
		this.selectedFile = ev.target.files[0];
	}

	@action.bound
	handleUrlChange(ev: React.ChangeEvent<HTMLInputElement>) {
		this.recordingURL = ev.target.value;
		this.selectedFile = undefined;

		this.urlIsValid = undefined;
		this.fetching = false;
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
