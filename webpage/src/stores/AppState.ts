import { action, computed, observable, reaction } from 'mobx';

import { EventedChannel } from '../utils/EventedChannel';

const VCR_URL = process.env.VCR_URL;

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

export class AppState {
	channel: EventedChannel;

	@observable recording = localStorage.getItem('recording');
	@observable recordingName = localStorage.getItem('recordingName');
	@observable recordingURL = '';

	@observable selectedFile: File = undefined;
	@observable started = false;
	@observable fetching = false;
	@observable urlExists?: boolean = undefined;
	@observable urlIsValid?: boolean = undefined;

	@observable showSettings = false;

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
				this.urlExists = undefined;

				fetch(url)
					.then((r) => {
						if (!r.ok) {
							throw r;
						} else {
							return r.text();
						}
					})
					.then((text) => {
						this.fetching = false;
						this.urlExists = true;

						if (text.startsWith('[0,"recorder-metadata"')) {
							this.recording = text;
							this.urlIsValid = true;
						} else {
							this.recording = undefined;
							this.urlIsValid = false;
						}
					})
					.catch(() => {
						this.recording = undefined;
						this.fetching = false;
						this.urlExists = false;
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
	get fetchTitle() {
		if (!this.recordingURL) {
			return null;
		}

		if (this.fetching) {
			return 'Fetching';
		} else if (!this.fetching && this.urlIsValid) {
			return 'Recording fetched';
		} else if (this.urlExists === false) {
			return 'URL not found';
		} else if (this.urlIsValid === false) {
			return 'URL is not a valid recording';
		}
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
		} else if (this.urlExists === false) {
			return '❌';
		} else if (this.urlIsValid === false) {
			return '⚠️';
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

		this.urlExists = undefined;
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

	@action.bound
	handleDemoClick() {
		this.recordingURL = `${VCR_URL}/data/test-recording-1.ndjson`;
	}

	@action.bound
	toggleSettings(visible = !this.showSettings) {
		this.showSettings = visible;
	}
}
