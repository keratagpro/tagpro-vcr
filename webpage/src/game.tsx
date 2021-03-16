import BackgroundPlayer from './utils/BackgroundPlayer';
import EventedChannel from './utils/EventedChannel';
import FakeSocket from './utils/FakeSocket';

declare var tagpro: TagPro;
declare var tagproConfig: TagProConfig;
declare var $: any;

const save = {
	sound: null as boolean,
	time: null as number,
	uiTimer: null,
	worldUpdate: null,
	setTimeout: null
};

tagpro.ready(() => {
	tagproConfig.serverHost = "#";
	tagproConfig.musicHost = "#";

	tagpro.spectator = true;
	tagpro.ui.spectatorInfo = () => {};

	const performanceInfo = tagpro.ui.performanceInfo;
	tagpro.ui.performanceInfo = (e, t, n, r) => {
		(tagpro.ping.avg as any) = "Unknown";
		performanceInfo(e, t, n, 0);
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

	tagpro.socket.on("time", e => {
		if (e.restore) {
			tagpro.sound = save.sound;
		}
	});

	tagpro.rawSocket.prependListener("end", e => {
		// Block setTimeout to prevent the default "end" handler
		// from trying to navigate back to the joiner

		save.setTimeout = window.setTimeout;
		window.setTimeout = (...args) => { return 0 };
	});

	tagpro.socket.on("vcr_end", e => {
		tagpro.state = TagPro.State.Ended;
	});
});

const io = {
	connect() {
		const player = new BackgroundPlayer();

		// NOTE: For testing
		// player.worker.on('packet', (ts, type, data) => console.log(ts, type, data));
		// player.worker.on('end', ev => console.log('End!'));

		const socket = new FakeSocket(player);

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

		channel.on('pause', () => {
			player.pause();

			if (tagpro.gameEndsAt && !tagpro.overtimeStartedAt) {
				save.time = tagpro.gameEndsAt.valueOf() - Date.now();
			} else if (tagpro.overtimeStartedAt) {
				save.time = Date.now() - tagpro.overtimeStartedAt.valueOf();
			}

			save.uiTimer = tagpro.ui.timer;
			save.worldUpdate = tagpro.world.update;

			tagpro.ui.timer = (...args) => {};
			tagpro.world.update = (...args) => {};
		});

		channel.on('unpause', () => {
			tagpro.ui.timer = save.uiTimer;
			tagpro.world.update = save.worldUpdate;

			if (tagpro.gameEndsAt && !tagpro.overtimeStartedAt) {
				tagpro.gameEndsAt = new Date(Date.now() + save.time);
			} else if (tagpro.overtimeStartedAt) {
				tagpro.overtimeStartedAt = new Date(Date.now() - save.time);
			}

			player.play();
		});

		channel.on('seek', to => {
			player.pause();

			save.sound = tagpro.sound;
			tagpro.sound = false;

			tagpro.gameEndsAt = null;
			tagpro.overtimeStartedAt = null;

			const players = tagpro.players;
			for (const id in players) {
				if (players.hasOwnProperty(id)) {
					players[id].lastSync = {};
					if (Number(id) !== tagpro.playerId) {
						player.emit("playerLeft", id);
					}
				}
			}

			for (let i = 0; i < 10; i++) {
				player.emit("chat", { from: null, to: "all", message: "\xa0" });
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
