import { action, makeObservable, observable, reaction, runInAction } from 'mobx';

import EventedChannel from '../utils/EventedChannel';

export class AppState {
	channel: EventedChannel;

	recording = localStorage.getItem('recording');
	recordingName = localStorage.getItem('recordingName');
	recordingURL = '';

	selectedFile: File = undefined;
	started = false;
	fetching = false;
	urlIsValid = undefined;

	constructor() {
		makeObservable(this, {
			recording: observable,
			recordingName: observable,
			recordingURL: observable,
			selectedFile: observable,
			started: observable,
			fetching: observable,
			urlIsValid: observable,
			handleFileSelect: action.bound,
			handleUrlChange: action.bound,
			handleStart: action.bound,
			handleStop: action.bound
		});

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
					runInAction(() => {
						this.recordingName = file.name;
						this.recording = reader.result as string;
					});
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
			.length > 0;
	}

	handleFileSelect(ev: React.ChangeEvent<HTMLInputElement>) {
		this.recordingURL = '';
		this.selectedFile = ev.target.files[0];
	}

	handleUrlChange(ev: React.ChangeEvent<HTMLInputElement>) {
		this.recordingURL = ev.target.value;
		this.selectedFile = undefined;

		this.urlIsValid = undefined;
		this.fetching = false;
	}

	handleStart() {
		if (!this.recording) {
			return;
		}

		this.started = true;
	}

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

function localStore<T>(target: T, key: keyof T & string) {
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
