import { action, computed, observable, reaction } from 'mobx';

import EventedChannel from '../utils/EventedChannel';

export default class AppState {
	channel: EventedChannel;

	@observable recording = localStorage.getItem('recording');
	@observable recordingName = localStorage.getItem('recordingName');
	@observable recordingURL = '';

	@observable selectedFile: File = undefined;
	@observable started = false;
	@observable fetching = false;
	@observable urlIsValid?: boolean = undefined;

	constructor() {
		const channel = new EventedChannel('vcr');
		this.channel = channel;

		channel.on('request-recording', () => {
			channel.emit('recording', parseRecording(this.recording));
		});

		reaction(
			() => this.selectedFile,
			(file) => {
				if (!file) {
					this.recordingName = undefined;
					this.recording = undefined;
					return;
				}

				const reader = new FileReader();

				reader.addEventListener('load', () => {
					this.recordingName = file.name;
					this.recording = reader.result as string;
				});

				reader.readAsText(file);
			}
		);

		reaction(
			() => this.recordingURL,
			(url) => {
				if (!this.recordingURL) {
					return;
				}

				this.fetching = true;

				fetch(url)
					.then((r) => {
						if (!r.ok) {
							throw r;
						} else {
							return r.text();
						}
					})
					.then((text) => {
						this.recording = text;
						this.fetching = false;
						this.urlIsValid = true;
					})
					.catch((err) => {
						this.recording = undefined;
						this.fetching = false;
						this.urlIsValid = false;
					});
			},
			{
				delay: 1000,
			}
		);

		reaction(() => this.recording, localStore(this, 'recording'));
		reaction(() => this.recordingName, localStore(this, 'recordingName'));
	}

	@computed
	get fetchIcon() {
		if (!this.recordingURL) {
			return null;
		}

		if (this.fetching) {
			return '🔎';
		} else if (!this.fetching && this.urlIsValid) {
			return '✔️';
		} else if (this.urlIsValid === false) {
			return '❌';
		}
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
		.filter((l) => l.trim().length > 0)
		.map((line) => JSON.parse(line));
}

function localStore<T>(target: T, key: keyof T) {
	return function () {
		if (target[key]) {
			// console.log('setting', key);
			localStorage.setItem(key as string, String(target[key]));
		} else {
			// console.log('removing', key);
			localStorage.removeItem(key as string);
		}
	};
}
