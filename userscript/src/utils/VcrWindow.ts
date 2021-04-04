import * as Penpal from 'penpal';

import * as utils from '.';
import { GameStorage, VcrGame } from './GameStorage';
import { Action, VcrSettings } from './VcrSettings';

import './VcrWindow.css';

const version = 'VCR_VERSION';
const vcrUrl = 'VCR_URL';

export default class VcrWindow {
	private settings: VcrSettings;
	private storage: GameStorage;
	private done: boolean;
	private games: VcrGame[];
	private playerWindow: Window;

	constructor(settings: VcrSettings, storage: GameStorage) {
		this.settings = settings;
		this.storage = storage;
		this.done = false;
	}

	addVcrLink() {
		const li = document.createElement('li');
		const link = document.createElement('a');

		link.href = '#';
		link.innerText = 'VCR';
		link.addEventListener('click', this.showVcrWindow.bind(this));

		li.id = 'nav-vcr';
		li.appendChild(link);

		const nav = document.querySelector('#site-nav > ul');
		nav.appendChild(li);
	}

	showVcrWelcomeIfNeeded() {
		const previous = this.settings.get('welcome') || 'Unknown';
		if (previous === version) return;

		const container = document.querySelector('#userscript-top + .container');
		container.innerHTML = /*html*/`
			<h1>Hi there, TagPro VCR User!</h1>

			<p>
				Sorry to interrupt but you'll only see this message when the userscript is first installed
				or udpated. If you've used the TagPro VCR before, things might be a bit different.
			</p>

			<p>
				Click on the VCR tab to get started (in the navigation bar above, all the way to the right).
				Then click back on the TAGPRO tab to play. Have fun!
			</p>

			<h3 class="header-title">Changelog</h3>

			<p>
				Installed now: ${version}<br />
				Previous version: ${previous}
			</p>

			<p><u>Version 1.1.0</u></p>
			<ul class="bullet-list">
				<li>Add the ability to launch replays directly from the browser.</li>
				<li>Make the number of saved games and the "short game" limit configurable.</li>
			</ul>

			<p><u>Version 1.0.1</u></p>
			<ul class="bullet-list">
				<li>Eliminate a dependency on a debugging library which isn't loading correctly.</li>
			</ul>

			<p><u>Version 1.0.0</u></p>
			<ul class="bullet-list">
				<li>Games are now saved in the browser by default.</li>
				<li>Added the VCR tab with details and settings.</li>
				<li>Added this automatic welcome screen.</li>
			</ul>
		`;

		this.settings.set('welcome', version);
	}

	async showVcrWindow() {
		if (this.done) return;
		this.done = true;

		const container = document.querySelector('#userscript-top + .container');
		const activeTab = document.querySelector('.active-tab');
		const vcrTab = document.querySelector('#nav-vcr');
		let newHTML: string;

		const actions: Action[] = [];

		const selectSave = this.settings.select('save', [10, 20, 30, 40, 50], actions);
		const selectShortSeconds = this.settings.select('shortSeconds', [10, 20, 30, 40, 50, 60], actions);

		const checkboxEnabled = this.settings.checkbox('enabled', `Recorder enabled (save new games)`, actions);
		const checkboxSkipSpectator = this.settings.checkbox('skipSpectator', `Don't save games where I am a spectator`, actions);
		const checkboxSkipShort = this.settings.checkbox('skipShort', `Don't save short games (&lt; ${selectShortSeconds} seconds)`, actions);

		const radioSave = this.settings.radio('download', `Save ${selectSave} most recent game files here in the browser`, false, actions);
		const radioDownload = this.settings.radio('download', `Download game files after each game`, true, actions);

		const settings = /*html*/`
			<p>&nbsp;</p>
			<div class="row form-group">
				<h4 class="header-title">Settings</h4>

				${checkboxEnabled}<br />
				${checkboxSkipSpectator}<br />
				${checkboxSkipShort}<br /><br />

				${radioSave}<br />
				${radioDownload}
			</div>
		`;

		const playButton = /*html*/`
			<div class="row form-group">
				<button class="btn btn-primary" id="openPlayer">Play Saved Recordings</button>
			</div>
		`;

		if (this.storage) {
			let table = /*html*/`
				<table class="table table-stripped row form-group">
					<thead>
						<th>Start</th>
						<th>Map</th>
						<th>Group?</th>
						<th>Duration</th>
						<th>Team</th>
						<th>Name</th>
						<th>Winner?</th>
						<th>Action</th>
					</thead>
					<tbody>
			`;

			this.games = (await this.storage.listGames()).reverse();
			this.games.forEach((game, idx) => {
				const duration = new Date(game.duration).toISOString().substr(14, 5);

				table += /*html*/`
						<tr>
							<td>${game.start}</td>
							<td>${game.map}</td>
							<td>${game.group ? "Yes" : "No"}</td>
							<td>${duration}</td>
							<td>${game.team}</td>
							<td>${game.name}</td>
							<td>${game.winner ? "Yes" : "No"}</td>
							<td>
								<a type="button" id="vcrFile" data-idx="${idx}" class="btn vcr-button vcr-button-download" title="Download"></a>&nbsp;
								<a type="button" id="vcrPlay" data-idx="${idx}" class="btn vcr-button vcr-button-play" title="Play"></a>
							</td>
						</tr>
				`;
			});

			if (this.games.length === 0) {
				table += /*html*/`
						<tr>
							<td colspan="8"><i>No games saved yet</i></td>
						</tr>
				`;
			}

			table += /*html*/`
					</tbody>
				</table>
			`;

			const spinner = /*html*/`
				<div class="vcr-mask vcr-hidden" id="vcrMask"><div class="vcr-mask-inside"></div></div>
			`;

			newHTML = /*html*/`
				<div class="row form-group">
					<h2>TagPro VCR</h2>
					<ul class="vcr-list">
						<li>Your ${this.storage.maxGames} most recent games will be stored in the browser.</li>
						<li>You can download a game file to save it forever, or launch the player directly from the list.</li>
						<li>Click the button below to visit the player website, and upload a saved game file to watch the replay.</li>
					</ul>
				</div>

				${playButton}
				${table}
				${settings}
				${spinner}
			`;
		} else {
			newHTML = /*html*/`
				<div class="row form-group">
					<h2>TagPro VCR</h2>
					<ul class="vcr-list">
						<li>Game files will automatically be downloaded after each game.</li>
						<li>Click the button below to visit the player website, and upload a game file to watch the replay.</li>
					</ul>
				</div>

				${playButton}
				${settings}
			`;
		}

		container.innerHTML = newHTML;

		document.querySelector('#openPlayer').addEventListener('click', this.openPlayer.bind(this));

		document.querySelectorAll('#vcrFile').forEach(link => link.addEventListener('click', this.downloadFile.bind(this)));
		document.querySelectorAll('#vcrPlay').forEach(link => link.addEventListener('click', this.launchPlayer.bind(this)));

		actions.forEach(action => action());

		if (activeTab) activeTab.classList.remove('active-tab');
		vcrTab.classList.add('active-tab');
	}

	private openPlayer(ev: MouseEvent, extraUrl?: string) {
		const url = vcrUrl + (extraUrl ?? '');

		if (this.playerWindow && this.playerWindow.window) {
			this.playerWindow.focus();
			this.playerWindow.location.href = url;
		} else {
			this.playerWindow = window.open(url, '_blank');
		}
	}

	private onClickData(ev: MouseEvent) {
		const target = ev.target as HTMLAnchorElement;
		const idx = +target.getAttribute("data-idx");
		const game = this.games[idx];
		const start = new Date(game.timestamp);
		const timestamp = utils.dateToString(start, true);
		const filename = `tagpro-recording-${timestamp}.ndjson`;

		return {
			'data': game.data,
			'filename': filename
		};
	}

	private downloadFile(ev: MouseEvent) {
		const game = this.onClickData(ev);

		utils.saveFile(game.data, game.filename);
	}

	private launchPlayer(ev: MouseEvent) {
		const game = this.onClickData(ev);

		$('#vcrMask').removeClass('vcr-hidden');

		const iframe = document.createElement('iframe');
		iframe.src = vcrUrl + 'launcher.html';
		iframe.setAttribute('style', 'display: none');
		document.body.appendChild(iframe);

		const connection = Penpal.connectToChild({ iframe, timeout: 30000 });

		const handleError = reason => {
			alert('Failed to launch player. Please try downloading your game file ' +
				'and uploading it to the player website. Reason: ' + reason);

			$('#vcrMask').addClass('vcr-hidden');

			document.body.removeChild(iframe);
		};

		connection.promise.then
			(
				child => {
					child.game(game.data, game.filename)
						.then(result => {
							document.body.removeChild(iframe);
							$('#vcrMask').addClass('vcr-hidden');

							this.openPlayer(undefined, '#launch');
						})
						.catch(reason => handleError(reason));
				},
				reason => handleError(reason)
			)
		.catch
			(
				reason => handleError(reason)
			);
	}
}
