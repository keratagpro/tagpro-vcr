import BackgroundPlayer from './utils/BackgroundPlayer';
import EventedChannel from './utils/EventedChannel';
import FakeSocket from './utils/FakeSocket';
import PauseableTimeouts from './utils/PauseableTimeout';

declare var tagpro: TagPro;
declare var tagproConfig: TagProConfig;
declare var $: any;

const save = {
	performanceInfo: null,
	seeking: false,
	sound: null as boolean,
	time: null as number,
	uiTimer: null,
	worldUpdate: null,
	map: null as any[][]
};

PauseableTimeouts.hookSetTimeout();

tagpro.ready(() => {
	$('#volumeSlider').blur();

	tagproConfig.serverHost = "#";
	tagproConfig.musicHost = "#";

	tagpro.spectator = true;
	tagpro.ui.spectatorInfo = () => {};

	save.performanceInfo = tagpro.ui.performanceInfo;
	tagpro.ui.performanceInfo = (e, t, n, r) => {
		(tagpro.ping.avg as any) = "N/A";
		save.performanceInfo(e, t, n, 0);
	};

	// The default "end" handler uses setTimeout to navigate back to
	// the joiner, then calls sendPingStatistics right after. We'll
	// override sendPingStatistics to cancel the timer and prevent
	// navigating away.

	tagpro.sendPingStatistics = () => {
		const id = window.setTimeout(() => {});
		clearTimeout(id - 1);
	};

	// Note: $.cookie returns boolean values here rather than strings
	// because global-game sets $.cookie.json = true

	if (!!$.cookie("vcrHideFlair")) {
		tagpro.renderer.drawFlair = () => {};
	}

	if (!!$.cookie("vcrHideRaptors")) {
		tagpro.renderer.layers.ui.children.forEach (c => {
			if (c.texture && c.texture.baseTexture && c.texture.baseTexture.imageUrl &&
				c.texture.baseTexture.imageUrl.includes('raptor')) {
					c.renderable = false;
				}
		});
	}

	const doSettings = () => {
		tagpro.settings.ui.allChat = !$.cookie("vcrHideAllChat");
		tagpro.settings.ui.teamChat = !$.cookie("vcrHideTeamChat");
		tagpro.settings.ui.groupChat = !$.cookie("vcrHideGroupChat");
		tagpro.settings.ui.systemChat = !$.cookie("vcrHideSystemChat");
		tagpro.settings.ui.names = !$.cookie("vcrHideNames");
		tagpro.settings.ui.degrees = !$.cookie("vcrHideDegrees");
		tagpro.settings.ui.matchState = !$.cookie("vcrHideMatchState");
		tagpro.settings.ui.performanceInfo = !$.cookie("vcrHidePerformanceInfo");
		tagpro.settings.ui.teamNames = !!$.cookie("vcrHideTeamNames") ? "never" : "always";
	};

	tagpro.socket.on("connect", doSettings);
	tagpro.socket.on("settings", doSettings);

	tagpro.socket.on("map", e => {
		save.map = JSON.parse(JSON.stringify(e.tiles));
	});

	tagpro.socket.on("vcr_time", e => {
		if (save.seeking) {
			PauseableTimeouts.setBase(e.time);
		}
	});

	tagpro.socket.on("vcr_end", e => {
		tagpro.state = TagPro.State.Ended;
	});

	tagpro.socket.on("vcr_seek", e => {
		tagpro.sound = save.sound;
		save.seeking = false;
		PauseableTimeouts.setBase(0);
		PauseableTimeouts.shiftAll(e.to);
	});
});

const io = {
	connect() {
		const player = new BackgroundPlayer();

		// NOTE: For testing
		// player.worker.on('packet', (ts, type, data) => console.log(ts, type, data));
		// player.worker.on('end', ev => console.log('End!'));

		const playerIds = () => {
			return Object.keys(tagpro.players).map(Number);
		}

		const onEmit = (type: string, data: any) => {
			let target: number;

			switch (type) {
				case 'next':
				case 'prev':
					const ids = type === 'next' ? playerIds().reverse() : playerIds();
					const cur = ids.indexOf(tagpro.playerId);
					target = ids[cur + 1] ?? ids[0];
					break;

				case 'redflagcarrier':
				case 'blueflagcarrier':
					const flag = type === 'redflagcarrier' ? 2 : 1;
					const team = type === 'redflagcarrier' ? 1 : 2;
					target = playerIds().find(id => (tagpro.players[id].flag === flag) ||
						(tagpro.players[id].flag === 3 && tagpro.players[id].team === team));
					break;
			}

			if (target) {
				player.emit('id', target);
			}
		};

		const socket = new FakeSocket(player, onEmit);

		const channel = new EventedChannel('vcr');
		channel.emit('request-recording');

		channel.on('recording', data => {
			player.load(data);
			player.play();

			channel.emit('show-controls');

			const timer = tagpro.ui.timer;
			tagpro.ui.timer = (...args) => {
				let time: number;

				if (tagpro.gameEndsAt && !tagpro.overtimeStartedAt) {
					time = tagpro.gameEndsAt.valueOf() - Date.now();
				} else if (tagpro.overtimeStartedAt) {
					time = Date.now() - tagpro.overtimeStartedAt.valueOf();
				}

				channel.emit('time-sync', { 'state': tagpro.state, 'time': time });

				timer(...args);
			}
		});

		let paused = false;

		const pause = () => {
			player.pause();
			PauseableTimeouts.pauseAll();

			paused = true;
			const now = Date.now();

			if (tagpro.gameEndsAt && !tagpro.overtimeStartedAt) {
				save.time = tagpro.gameEndsAt.valueOf() - now;
			} else if (tagpro.overtimeStartedAt) {
				save.time = now - tagpro.overtimeStartedAt.valueOf();
			}

			save.uiTimer = tagpro.ui.timer;
			save.worldUpdate = tagpro.world.update;

			tagpro.ui.timer = (...args) => {};
			tagpro.world.update = (...args) => {};
		};

		const unpause = () => {
			tagpro.ui.timer = save.uiTimer;
			tagpro.world.update = save.worldUpdate;

			const now = Date.now();

			if (tagpro.gameEndsAt && !tagpro.overtimeStartedAt) {
				(tagpro.gameEndsAt as any) = now + save.time;
			} else if (tagpro.overtimeStartedAt) {
				(tagpro.overtimeStartedAt as any) = now - save.time;
			}

			PauseableTimeouts.resumeAll();
			player.play();

			paused = false;
		};

		channel.on('pause', pause);
		channel.on('unpause', unpause);

		channel.on('seek', to => {
			if (!paused) {
				player.pause();
			}

			save.seeking = true;
			save.sound = tagpro.sound;
			tagpro.sound = false;

			tagpro.gameEndsAt = null;
			tagpro.overtimeStartedAt = null;

			playerIds().forEach(id => {
				tagpro.players[id].lastSync = {};
				if (id !== tagpro.playerId) {
					player.emit('playerLeft', id);
				}
			});

			// Fire any pending timers now
			// After the seek is complete, any new timers will be time-shifted

			PauseableTimeouts.shiftAll(-1);

			const update = tagpro.world.update;
			tagpro.world.update = (...args) => {
				tagpro.renderer.layers.splats.removeChildren();

				for (let x = 0; x < save.map.length; x++) {
					for (let y = 0; y < save.map[x].length; y++) {
						tagpro.renderer.updateDynamicTile({ x, y, v: save.map[x][y] });
					}
				}

				tagpro.world.update = update;
				update(...args);
			}

			player.seek(to);
			player.play();
		});

		channel.on('reload', () => {
			location.reload();
		});

		return socket;
	}
};

window['io'] = io;

// NOTE: Testing.
// io.connect();
