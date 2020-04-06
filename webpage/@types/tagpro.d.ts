//
// Declared as a module, e.g. `import tagpro from 'tagpro';`
//
declare module 'tagpro' {
	var tagpro: TagPro;
	export default tagpro;
}

//
// Declared as a variable on window, i.e. `window.tagpro`
//
declare interface Window {
	tagpro: TagPro;
}

declare class TagPro {
	disableControls: boolean;
	music: boolean;
	resourcesLoaded: boolean;
	sound: boolean;
	spectator: boolean;

	gameSocket: any;
	host: string;
	musicHost: string;
	rawSocket: SocketIO.Socket;
	serverHost: string;
	serverPort: number;
	socket: TagPro.Socket;
	socketHost: string;
	socketPort: number;

	events: TagPro.Events;
	helpers: TagPro.Helpers;
	keys: TagPro.Keys;
	objects: { [id: string]: PIXI.DisplayObject };
	particleDefinitions: TagPro.ParticleDefinitions;
	players: { [id: string]: TagPro.Player };
	settings: TagPro.Settings;
	soundTiles: TagPro.SoundTiles;
	teamNames: { blueTeamName: string; redTeamName: string };
	tiles: TagPro.Tiles;

	floorMap: Array<Array<number>>;
	map: TagPro.Map;
	wallMap: Array<Array<Array<number | string>>>;

	chat: TagPro.Chat;
	fps: number;
	gameEndsAt: Date;
	group: TagPro.Group;
	kick: TagPro.Kick;
	musicPlayer: TagPro.MusicPlayer;
	ping: TagPro.Ping;
	playerId: number;
	renderer: TagPro.Renderer;
	score: { b: number; r: number };
	spectators: number;
	state: TagPro.State;
	ui: TagPro.UI;
	version: string;
	viewport: TagPro.Viewport;
	volume: number;
	world: TagPro.World;
	zoom: number;
	zooming: number;

	TILE_SIZE: number;

	ready: {
		(callback): void;
		after(callback): void;
	};

	_afterReadyCallbacks: Array<any>;

	createSocket(): TagPro.Socket;
	joinGame(): void;
	playSound(name): void;
	sendKeyPress(direction: string, released: boolean): void;
	showOptions(): void;
	stopSound(sound: string): void;
	updateSounds(): void;
}

declare namespace TagPro {
	interface Chat {
		resize(): void;
	}

	interface Events {
		register();
	}

	interface Helpers {
		pad(str): string;
		timeFromSeconds(seconds: number): string;
	}

	interface Group {
		socket: SocketIO.Socket;
	}

	interface Keys {}

	interface Kick {
		clickBall(): void;
		player(player): void;
	}

	interface Layers {
		background: PIXI.Container;
		foreground: PIXI.Container;
		midground: PIXI.Container;
		overlay: PIXI.particles.ParticleContainer;
		splats: PIXI.particles.ParticleContainer;
		ui: PIXI.Container;
	}

	interface Map extends Array<Array<number | string>> {
		splats: Array<{ x: number; y: number; t: number }>;
	}

	interface MusicPlayer {
		current;
		keyBindings: Object;
		list: Array<any>;
		mute();
		next();
	}

	interface Options {
		disableParticles: boolean;
		forceCanvasRenderer: boolean;
		disableViewportScaling: boolean;
		transparent: boolean;
	}

	interface ParticleDefinition {
		alpha: { start: number; end: number };
		scale: { start: number; end: number; minimumScaleMultiplier: number };
		color: { start: string; end: string };
		speed: { start: number; end: number };
		acceleration: { x: number; y: number };
		startRotation: { min: number; max: number };
		rotationSpeed: { min: number; max: number };
		lifetime: { min: number; max: number };
		blendMode: string;
		frequency: number;
		emitterLifetime: number;
		maxParticles: number;
		pos: Position;
		addAtBack: boolean;
		spawnType: string;
		spawnCircle: { x: number; y: number; r: number };
	}

	interface ParticleDefinitions {
		death: ParticleDefinition;
		explosion: ParticleDefinition;
		gravityWell: ParticleDefinition;
		playerEmitter: ParticleDefinition;
		rollingBomb: ParticleDefinition;
		tagproSparks: ParticleDefinition;
	}

	interface Ping {
		avg: number;
		current: number;
		history: Array<number>;
		loss: number;
	}

	interface Player {
		/** Angular velocity */
		a: number;
		/** Acceleration possible by player under their own power. */
		ac: number;
		angle: number;
		auth: boolean;
		bomb: boolean;
		dead: boolean;
		degree: number;
		/** Density of player fixture */
		den: number;
		/** Indicates the player's location was set directly by the server,
		 * occurs after death and when there is a large deviation between
		 * client and server. */
		directSet: boolean;
		down: boolean;
		draw: boolean;
		flag: number;
		grip: boolean;
		lastSync: { [id: string]: number };
		lx: number;
		ly: number;
		ms: number;
		name: string;
		points: number;
		potatoFlag: boolean;
		rotateFlairSpeed: number;
		selfDestructSoon: boolean;
		sprite: PIXI.Sprite;
		tagpro: boolean;
		team: number;
		tween: any;
		toUpdate: boolean;
		x: number;
		y: number;

		flair: {
			x: number;
			y: number;
			description: string;
		};

		sprites: {
			emitter: any; // NOTE: cloudkid.Emitter
			rotation: number;

			actualBall: PIXI.Sprite;
			ball: PIXI.Sprite;
			bomb: PIXI.Graphics;
			degrees: PIXI.Sprite;
			flag: PIXI.Sprite;
			flagLayer: PIXI.Container;
			flair: PIXI.Sprite;
			grip: PIXI.Sprite;
			info: PIXI.Sprite;
			name: PIXI.Sprite;
			rollingBomb: any; // NOTE: cloudkid.Emitter
			tagpro: PIXI.Sprite;
			tagproSparks: any; // NOTE: cloudkid.Emitter
			tagproTint: PIXI.Graphics;
			selfDestructSoon: any; //NOTE: cloudkid.Emitter
		};
	}

	interface Position {
		x: number;
		y: number;
	}

	interface Settings {
		stats: boolean;
		ui: {
			allChat: boolean;
			degrees: boolean;
			groupChat: boolean;
			matchState: boolean;
			names: boolean;
			performanceInfo: boolean;
			spectatorInfo: boolean;
			systemChat: boolean;
			teamChat: boolean;
			teamNames: boolean;
		};
	}

	interface Socket {
		on(eventName, callback);
		emit(eventName, ...items);
	}

	interface SoundTiles {
		alert;
		alertLong;
		burst;
		burstOther;
		cheering;
		countdown;
		degreeup;
		drop;
		dynamite;
		dynamiteOther;
		friendlyalert;
		friendlydrop;
		go;
		pop;
		popOther;
		portal;
		portalOther;
		powerup;
		powerupOther;
		rolling;
		rollingOther;
		sigh;
		switchOff;
		switchOffOther;
		switchOn;
		switchOnOther;
		teleport;
		teleportOther;
	}

	enum State {
		Active = 1,
		Ended = 2,
		NotStarted = 3,
	}

	interface Tiles extends Array<any> {
		image;

		draw(container: PIXI.Container, tile: string | number, position: Position, width: number, height: number): void;
		drawLayers(container, x, y, position, container2): void;
		getTexture(tileId): void;

		splats: {
			red: Array<PIXI.Sprite>;
			blue: Array<PIXI.Sprite>;
		};
	}

	interface UI {
		blueFlagTaken: boolean;
		redFlagTaken: boolean;
		yellowFlagTakenByRed: boolean;
		yellowFlagTakenByBlue: boolean;
		bluePotatoTaken: boolean;
		redPotatoTaken: boolean;
		yellowPotatoTakenByRed: boolean;
		yellowPotatoTakenByBlue: boolean;

		enabled: boolean;
		// flags;
		// sprites: Object;

		alignUI(): void;
		largeAlert(): void;
		performanceInfo(): void;
		resize(width: number, height: number): void;
		scores(): void;
		spectatorInfo(): void;
		timer(): void;
		update(): void;
		updateFlags(): void;
	}

	interface Viewport {
		followPlayer: boolean;
		centerLock: boolean;
		source: Position;

		setAudioPosition();
		setAudioVelocity();
	}

	interface World {
		createGravityWell(x, y): void;
		destoryPlayer(playerId): void;
		syncObject(): void;
		syncPlayer(): void;
		update(): void;
	}

	interface Renderer {
		canvas: HTMLCanvasElement;
		canvas_height: number;
		canvas_width: number;
		debug: boolean;
		options: Options;
		particleDefinitions: ParticleDefinitions;
		type: number;
		vpHeight: number;
		vpWidth: number;

		backgroundChunks: Array<PIXI.Sprite>;
		gameContainer: PIXI.Container;
		particleFireTexture: PIXI.Texture;
		particleTexture: PIXI.Texture;
		renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
		stage: PIXI.Container;

		/**
		 * Holds all map elements that we want to be able to update.
		 */
		dynamicSprites: Object;

		/**
		 * A list of all particle emitters for efficient updating.
		 */
		emitters: Array<any>;

		/**
		 * A list of explosions, but only if particles are turned off.
		 */
		explosions: Array<PIXI.Graphics>;

		/**
		 * A list of splats that should be fading away over time.
		 */
		fadingSplats: Array<any>;

		frameCount: number;

		/**
		 * A list of recent frame rates (calculated from tr.renderDelta) used to calculate
		 */
		frameRates: Array<number>;

		/**
		 * Holds all PIXI.DisplayObject instances that represent various layers of the playing field from background to UI.
		 */
		layers: Layers;
		zoomThreshold: number;

		addPlayerSprite(player: Player): void;

		addSplat(team, x, y, fadeAway): void;

		addStatePlayer(sprite): void;

		centerCameraPosition(): void;

		centerContainerToPoint(x, y): void;

		/**
		 * Centers the canvas and canvasDiv. Resizes canvasDiv if necessary.
		 */
		centerView(): void;

		checkIfVisible(): boolean;

		checkSelfDestruct(player: Player): void;

		chunkifyBackground(renderTexture): void;

		/**
		 * Removes all children from the background.
		 */
		clearBackground(): void;

		createBackground(): void;

		createBackgroundTexture(container): void;

		createBallSprite(player: Player): void;

		createExplosion(x, y): void;

		/**
		 * Creates the foreground DisplayObjectContainer and appends itself to the specified container.
		 */
		createForeground(container): void;

		createGameContainer(stage): PIXI.Container;

		createGravityWellEmitter(x, y): void;

		/**
		 * Creates all PIXI.DisplayObjectContainers which we'll shove all of the sprites into.
		 */
		createLayers(): void;

		/**
		 * Layer creation functions.
		 */
		createMidground(): void;

		/**
		 * Creates the overlay DisplayObjectContainer and appends itself to the specified container.
		 *
		 * @param {PIXI.DisplayObjectContainer} container - The container to put the foreground in.
		 */
		createOverlay(container): void;

		createParticle(selector): PIXI.Texture;

		createPlayerEmitter(player: Player): void;

		createPlayerSprite(player: Player): void;

		/**
		 * Creates the renderer. Currently this only uses the autoDetectRenderer,
		 * though we'll allow settings to select a specific renderer.
		 */
		createRenderer(): PIXI.SystemRenderer;

		createUI(): void;

		/**
		 * Destroys a player's sprites.
		 */
		destroyPlayer(player: Player): void;

		drawAnimation(tile, drawPos): PIXI.extras.AnimatedSprite;

		drawBackground(): void | boolean;

		/**
		 * Draws all background tiles into the specified container.
		 */
		drawBackgroundTiles(container: PIXI.Container): void;

		drawBallPop(x, y, team): void;

		drawDegree(player: Player): void;

		drawDynamicTile(x, y): void;

		drawDynamicTiles(): void;

		drawFlair(player: Player): void;

		/**
		 * Draws the marsball sprite if it doesn't already exist.
		 *
		 * @param {object} object - The marsball object created by
		 * @param {Position} position - A simple object vector. x and y.
		 */
		drawMarsball(object, position: Position): void;

		drawName(player: Player, forceRedraw: boolean): void;

		/**
		 * Draws all the visible players and updates their attributes.
		 *
		 * @param {Player} player - The player object.
		 * @param {PIXI.DisplayObjectContainer} context - The container to render into.
		 */
		drawPlayer(player: Player, context: PIXI.Container): Position;

		/**
		 * Simply calls tr.drawPlayer on all the players.
		 *
		 * @param {PIXI.DisplayObjectContainer} context - The container to render into.
		 */
		drawPlayers(context: PIXI.Container): void;

		drawSpawn(x: number, y: number, team: number, timeout: number): void;

		drawSplat(x: number, y: number, team: number, showDeath: boolean, fadeAway: boolean): void;

		drawStartingSplats(): void;

		getFlairTexture(cacheKey: string, flair: Object): PIXI.Texture;

		getLockedPosition(player: Player): Position;

		handleMapUpdate(data: Array<Position>): void;

		largeText(text, color): PIXI.Text;

		/**
		 * Measures the time delta between two frames and pushes the instantaneous
		 * framerate to an array. If there are framerates in the tr.frameRates array,
		 * compute an actual FPS and assign it to fps.
		 */
		measurePerformance(): void;

		prettyText(text, color): PIXI.Text;

		/**
		 * Simple check to see whether we're ready to draw the background.
		 */
		readyToDrawBackground(): boolean;

		/**
		 * The main function. Calls all applicable functions which then
		 * render the screen.
		 */
		render(): void;

		resetFlagStatuses(): void;

		/**
		 * Resizes the canvas, and centers both it and the enclosing div.
		 */
		resizeAndCenterView(): void;

		/**
		 * Resizes the canvas contained under the renderer.
		 */
		resizeView(): void;

		/**
		 * Displays an opening console message.
		 */
		sayHello(): void;

		setupPlayerSprites(player: Player): void;

		/**
		 * Starts the renderer and rendering loop.
		 */
		start(): void;

		startDeathEmitter(startColor, stopColor, x, y): void;

		updateBackgroundVisibility(): void;

		updateCamera(id): void;

		updateCameraPosition(player: Player): void;

		updateCameraZoom(): void;

		updateDeathStatus(player: Player, drawPos): void;

		updateEmitters(): void;

		updateExplosions(): void;

		updateFadingSplats(): void;

		updateFlagsFromPlayer(player: Player): void;

		updateGraphics(): void;

		updateGrip(player: Player, context: PIXI.Container, drawPos: Position): void;

		updateMarsBall(object, position): void;

		updateObjects(): void;

		updatePlayer(player: Player): void;

		updatePlayerColor(player: Player): void;

		updatePlayerEmitter(player: Player): void;

		updatePlayerFlag(player: Player): void;

		updatePlayerPowerUps(player: Player, context: PIXI.Container, drawPos: Position): void;

		updatePlayerSpritePosition(player: Player): void;

		updatePlayerVisibility(player: Player): void;

		updatePlayers(): void;

		updateRollingBomb(player: Player): void;

		updateTagpro(player: Player): void;

		updatedynamicTile(update: Position): void;

		veryPrettyText(text, color): PIXI.Sprite;
	}
}
