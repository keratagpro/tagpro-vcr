import * as utils from '.';
import { GameStorage, VcrGame } from './GameStorage';
import VcrSettings from './VcrSettings';

const version = 'VCR_VERSION';

export default class VcrWindow {
	private settings: VcrSettings;
	private storage: GameStorage;
	private done: boolean;
	private games: VcrGame[];

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
		const previous = this.settings.welcome || 'Unknown';
		if (previous === version) return;

		const container = document.querySelector('#userscript-top + .container');
		container.innerHTML = `
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

			<p><u>Version 1.0.0</u></p>
			<ul class="bullet-list">
				<li>Games are now saved in the browser by default.</li>
				<li>Added the VCR tab with details and settings.</li>
				<li>Added this automatic welcome screen.</li>
			</ul>
		`;

		this.settings.welcome = version;
	}

	async showVcrWindow() {
		if (this.done) return;
		this.done = true;

		const container = document.querySelector('#userscript-top + .container');
		const activeTab = document.querySelector('.active-tab');
		const vcrTab = document.querySelector('#nav-vcr');
		let newHTML: string;

		const vcrEnabledChecked = this.settings.enabled ? "checked" : "";
		const vcrDownloadChecked = this.settings.download ? "checked" : "";
		const vcrSaveChecked = this.settings.download ? "" : "checked";

		const settings = `
			<p>&nbsp;</p>
			<div class="row form-group">
				<h4 class="header-title">Settings (reload page after changing)</h4>
				<input id="vcrEnabled" type="checkbox" ${vcrEnabledChecked} /><label class="checkbox-inline" for="vcrEnabled">Recorder enabled (save new games)</label><br /><br />
				<input id="vcrSave" type="radio" name="vcrDownloadRadio" value="false" ${vcrSaveChecked} /><label class="radio-inline" for="vcrSave">Save game files here in the browser</label><br />
				<input id="vcrDownload" type="radio" name="vcrDownloadRadio" value="true" ${vcrDownloadChecked} /><label class="radio-inline" for="vcrDownload">Download game files after each game</label>
			</div>
		`;

		const playButton = `
			<div class="row form-group">
				<a class="btn btn-primary" href="VCR_URL" target="_blank">Play Your Recordings</a>
			</div>
		`;

		if (this.storage) {
			let table = `
				<table class="table table-stripped row form-group">
					<thead>
						<th>Start</th>
						<th>Map</th>
						<th>Group?</th>
						<th>Duration</th>
						<th>Team</th>
						<th>Name</th>
						<th>Winner?</th>
						<th>Download</th>
					</thead>
					<tbody>
			`;

			this.games = (await this.storage.listGames()).reverse();
			this.games.forEach((game, idx) => {
				const duration = new Date(game.duration).toISOString().substr(14, 5);

				table += `
						<tr>
							<td>${game.start}</td>
							<td>${game.map}</td>
							<td>${game.group ? "Yes" : "No"}</td>
							<td>${duration}</td>
							<td>${game.team}</td>
							<td>${game.name}</td>
							<td>${game.winner ? "Yes" : "No"}</td>
							<td>
								<a class="btn btn-secondary btn-tiny" href="#" id="vcrFile" data-idx="${idx}">Download</a>
							</td>
						</tr>
				`;
			});

			if (this.games.length === 0) {
				table += `
						<tr>
							<td colspan="8"><i>No games saved yet</i></td>
						</tr>
				`;
			}

			table += `
					</tbody>
				</table>
			`;

			newHTML = `
				${playButton}

				<div class="row form-group">
					Your ${this.storage.maxGames} most recent games will be stored in the browser.
					You can download a game file from the list. Then click the button above to
					visit the player website, and upload your game file to watch the replay.
				</div>

				${table}
				${settings}
			`;
		} else {
			newHTML = `
				${playButton}

				<div class="row form-group">
					Game files will automatically be downloaded after each game.
					Click the button to visit the player website, and upload a
					game file to watch the replay.
				</div>

				${settings}
			`;
		}

		container.innerHTML = newHTML;

		document.querySelectorAll('#vcrFile').forEach(link => {
			link.addEventListener('click', this.downloadFile.bind(this));
		});

		document.querySelector('#vcrEnabled').addEventListener('click', this.setEnabled.bind(this));
		document.querySelector('#vcrDownload').addEventListener('click', this.setDownload.bind(this));
		document.querySelector('#vcrSave').addEventListener('click', this.setDownload.bind(this));

		activeTab.classList.remove('active-tab');
		vcrTab.classList.add('active-tab');
	}

	private downloadFile(ev: MouseEvent) {
		const target = ev.target as HTMLAnchorElement;
		const idx = +target.getAttribute("data-idx");
		const game = this.games[idx];
		const start = new Date(game.timestamp);
		const timestamp = utils.dateToString(start, true);

		utils.saveFile(game.data, `tagpro-recording-${timestamp}.ndjson`);
	}

	private setEnabled(ev: MouseEvent) {
		const target = ev.target as HTMLInputElement;
		this.settings.enabled = target.checked;
	}

	private setDownload(ev: MouseEvent) {
		const target = ev.target as HTMLInputElement;
		this.settings.download = (target.value === 'true');
	}
}
