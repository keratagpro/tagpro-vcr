import { makeAutoObservable, reaction, runInAction } from 'mobx';
import React from 'react';

import EventedChannel from '../utils/EventedChannel';
import { Packet } from '../utils/PacketDataPlayer';

const fetchPatterns = [
	new RegExp('^https://res\\.cloudinary\\.com/eggball/raw/upload/EggBall/[0-9]+.ndjson$')
];

export enum GameTypes {
	NORMAL,
	EGGBALL,
	DRAGON_TOWER
}

export enum Modals {
	NONE,
	FAILED,
	FORBIDDEN,
	FETCHING,
	LAUNCH
}

export class AppState {
	channel: EventedChannel;

	recording = localStorage.getItem('recording');
	recordingName = localStorage.getItem('recordingName');
	recordingURL = '';

	selectedFile: File = undefined;
	packets: Packet[] = undefined;
	modal = Modals.NONE;
	settings = false;
	fetching = false;
	urlIsValid = undefined;
	started = false;
	playing = false;
	paused = false;
	seeking = false;
	finished = false;

	minTS = 0;
	maxTS = 0;
	maxTSSeek = 0;
	currentTS = 0;
	sliderTS = 0;
	firstTimePacket: Packet = undefined;
	startPacket: Packet = undefined;
	overtimePacket: Packet = undefined;
	initialState = 0;

	constructor() {
		makeAutoObservable(this, { channel: false, packets: false }, { autoBind: true });

		const channel = (this.channel = new EventedChannel('vcr'));

		channel.on('request-recording', this.handleRequestRecording);
		channel.on('show-controls', this.handleShowControls);
		channel.on('time-sync', this.handleTimeSync);

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
						runInAction(() => {
							this.recording = text;
							this.recordingName = url.replace(/[#?].*$/, '').replace(/^.*\//, '');
							this.fetching = false;
							this.urlIsValid = true;

							if (this.modal === Modals.FETCHING) {
								this.modal = Modals.LAUNCH;
							}
						});
					})
					.catch(err => {
						runInAction(() => {
							this.recording = undefined;
							this.fetching = false;
							this.urlIsValid = false;

							if (this.modal === Modals.FETCHING) {
								this.modal = Modals.FAILED;
							}
						});
					});
			},
			{
				delay: 1000
			}
		);

		reaction(() => this.recording, localStore(this, 'recording'));
		reaction(() => this.recordingName, localStore(this, 'recordingName'));

		this.checkHash();
		window.addEventListener('hashchange', this.hashChange);
	}

	checkHash() {
		const hash = location.hash;

		if (hash === '#launch') {
			this.modal = Modals.LAUNCH;
		}

		if (hash.startsWith('#fetch=')) {
			const url = hash.substr(7);
			const valid = !!fetchPatterns.find(p => url.match(p));

			if (valid) {
				this.modal = Modals.FETCHING;

				this.recording = '';
				this.recordingName = '';
				this.recordingURL = url;
			} else {
				this.modal = Modals.FORBIDDEN;
			}
		}

		location.hash = '';
	}

	hashChange() {
		const hash = location.hash;

		if (hash !== '' && hash !== '#') {
			location.reload();
		}
	}

	gameType() {
		const mapPacket = this.packets.find(p => p[1] === 'map');

		try {
			switch (mapPacket[2].info.name) {
				case 'Egg Ball':
					return GameTypes.EGGBALL;

				case 'Tower of the TagPro Dragon':
					return GameTypes.DRAGON_TOWER;
			}
		} catch {
			// ignore
		}

		return GameTypes.NORMAL;
	}

	handleSettings() {
		this.settings = !this.settings;
	}

	handleFileSelect(ev: React.ChangeEvent<HTMLInputElement>) {
		this.selectedFile = ev.target.files[0];
		ev.target.value = '';
	}

	handleUrlChange(ev: React.ChangeEvent<HTMLInputElement>) {
		this.recordingURL = ev.target.value;
		this.selectedFile = undefined;

		this.urlIsValid = undefined;
		this.fetching = false;
	}

	handleRequestRecording() {
		this.finished = false;
		this.paused = false;
		this.playing = false;
		this.currentTS = this.minTS;
		this.sliderTS = this.minTS;

		this.channel.emit('recording', this.packets);
	}

	handleShowControls() {
		this.playing = true;
	}

	handleTimeSync(data) {
		const state = data.state;
		const time = data.time;

		if (state === TagPro.State.Ended) {
			this.currentTS = this.maxTS;
			this.sliderTS = this.maxTS;
			this.finished = true;
			return;
		}

		if (state === TagPro.State.Overtime) {
			this.currentTS = this.overtimePacket[0] + time;
		} else {
			const packet = (state === TagPro.State.NotStarted) ? this.firstTimePacket : this.startPacket;
			this.currentTS = packet[0] + (packet[2].time - time);
		}

		if (!this.seeking) {
			this.sliderTS = this.currentTS;
		}
	}

	handleButton(ev: React.MouseEvent) {
		const target = ev.target as HTMLButtonElement;

		switch (target.getAttribute('data-state')) {
			case 'pause':
				this.handlePause();
				break;

			case 'play':
				this.handleUnpause();
				break;

			case 'reload':
				this.handleReload();
				break;
		}
	}

	handleDismissModal() {
		this.modal = Modals.NONE;
	}

	handleStart() {
		this.modal = Modals.NONE;

		if (!this.recording) {
			return;
		}

		this.settings = false;
		let failed = false;

		try {
			this.parseRecording(this.recording);
		} catch {
			failed = true;
		}

		if (!failed) {
			failed ||= this.packets[0][1] !== 'recorder-metadata';

			this.packets.forEach(p => {
				failed ||= typeof p[0] !== 'number';
				failed ||= typeof p[1] !== 'string';
			});
		}

		if (failed) {
			this.modal = Modals.FAILED;
			this.recording = undefined;
			this.recordingName = undefined;
			return;
		}

		this.started = true;
	}

	handleStop() {
		this.started = false;
		this.playing = false;
	}

	handlePause() {
		this.paused = true;
		this.channel.emit('pause');
	}

	handleUnpause() {
		this.paused = false;
		this.channel.emit('unpause');
	}

	handleReload() {
		this.channel.emit('reload');
	}

	handleJump(ev: React.MouseEvent) {
		const target = ev.target as HTMLButtonElement;
		const delta = Number(target.getAttribute('data-jump')) * 1000;
		const nextTS = Math.min(Math.max(this.currentTS + delta, this.minTS), this.maxTSSeek);

		this.handleSeek(nextTS);
	}

	handleSlider(pos: number) {
		this.sliderTS = pos;
		this.seeking = true;
	}

	handleSeek(to: number) {
		if (this.paused) {
			this.handleUnpause();
		}

		if (this.finished) {
			this.currentTS = this.maxTS;
			this.sliderTS = this.maxTS;
			this.seeking = false;
			return;
		}

		this.channel.emit('seek', to);
		this.seeking = false;
	}

	parseRecording(data: string) {
		const packets: Packet[] = data
			.split('\n')
			.filter(l => l.trim().length > 0)
			.map(line => JSON.parse(line));

		const endIndex = packets.findIndex(p => p[1] === 'end');
		const endPacket = packets[endIndex] || packets[packets.length-1];
		const duration = endPacket[0];

		const connect = packets.find(p => p[1] === 'connect');
		if (connect) {
			connect[2] ||= {};
			connect[2].duration = duration;
		} else {
			packets.splice(1, 0, [0, 'connect', { 'duration': duration }]);
		}

		this.firstTimePacket = packets.find(p => p[1] === 'time');
		this.startPacket = packets.find(p => p[1] === 'time' && p[2].state === TagPro.State.Active);
		this.overtimePacket = packets.find(p => p[1] === 'time' && p[2].state === TagPro.State.Overtime);
		this.initialState = this.firstTimePacket[2].state;

		this.minTS = this.firstTimePacket[0];
		this.maxTS = endPacket[0];
		this.maxTSSeek = this.maxTS - (this.maxTS % 1000);

		this.packets = packets;
	}
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
