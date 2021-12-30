import classnames from 'classnames';
import { observer } from 'mobx-react';
import * as React from 'react';

import { Circle } from 'rc-progress';
import ProgressTimer from 'react-progress-timer';

import Slider, { SliderTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css'

import { AppState, GameTypes, Modals } from '../stores/AppState';
import * as ProfileSettings from '../utils/ProfileSettings';
import * as Textures from '../utils/Textures';
import Modal from './Modal';

import './App.css';

interface IProps {
	appState: AppState;
}

const gameFiles = {
	[GameTypes.NORMAL]: 'game.html',
	[GameTypes.EGGBALL]: 'game-egg.html',
	[GameTypes.DRAGON_TOWER]: 'game-dragon-tower.html',
	[GameTypes.JIMMYS_DUNGEON]: 'game-jimmys-dungeon.html'
}

export const App = observer(class AppClass extends React.Component<IProps> {
	renderGame() {
		const { appState } = this.props;

		const gameType = appState.gameType();
		const gameSrc = gameFiles[gameType];

		return <iframe id="game-frame" src={gameSrc} frameBorder="0" />;
	}

	renderSettings() {
		const { appState } = this.props;

		return (
			<div className="container grid-sm panel">
				<div className="panel-header">
					<div className="panel-title h5">TagPro VCR Playback Settings</div>
				</div>
				<div className="panel-body">
					<div className="columns">
						<div className="column col-6">
							<h6>Chat</h6>
							{ProfileSettings.renderProfileCheckbox('vcrHideAllChat', 'Show All Chat', false)}<br />
							{ProfileSettings.renderProfileCheckbox('vcrHideTeamChat', 'Show Team Chat', false)}<br />
							{ProfileSettings.renderProfileCheckbox('vcrHideGroupChat', 'Show Group Chat', false)}<br />
							{ProfileSettings.renderProfileCheckbox('vcrHideSystemChat', 'Show System Chat', false)}<br />
							<p />
							<h6>HUD</h6>
							{ProfileSettings.renderProfileCheckbox('vcrHideNames', 'Show Player Names', false)}<br />
							{ProfileSettings.renderProfileCheckbox('vcrHideDegrees', 'Show Player Degrees', false)}<br />
							{ProfileSettings.renderProfileCheckbox('vcrHideMatchState', 'Show Time, Score & Flags', false)}<br />
							{ProfileSettings.renderProfileCheckbox('vcrHidePerformanceInfo', 'Show FPS', false)}<br />
							<p />
							<h6>Video Settings</h6>
							{ProfileSettings.renderProfileCheckbox('disableParticles', 'Enable Particle Effects', false)}<br />
							{ProfileSettings.renderProfileCheckbox('forceCanvasRenderer', 'Enable WebGL Rendering', false)}
								{' '}
								<button className="btn btn-primary btn-sm btn-action btn-question circle tooltip large-tooltip"
									data-tooltip="Note to Chrome users: WebGL rendering will always be disabled. This is required to support video capture, which is only available in Chrome."
								>?</button>
								<br />
							{ProfileSettings.renderProfileCheckbox('disableViewportScaling', 'Enable Viewport Scaling', true)}<br />
						</div>
						<div className="column col-6">
							<h6>EggBall</h6>
							{ProfileSettings.renderProfileCheckbox('vcrHideRaptors', 'Show Raptors', false)}<br />
							<p />
							<h6>Other</h6>
							{ProfileSettings.renderProfileCheckbox('disableBallSpin', 'Enable Ball Spin', false)}<br />
							{ProfileSettings.renderProfileCheckbox('vcrHideTeamNames', 'Show Custom Team Names', false)}<br />
							{ProfileSettings.renderProfileCheckbox('vcrHideFlair', 'Show Flair', false)}<br />
							<p />
							Tile Respawn Warnings:<br />
							{ProfileSettings.renderTileRespawnSelect()}<br />
						</div>
					</div>
					<p />
					<div>
						<button className="btn centered" onClick={appState.handleSettings}>Done</button>
					</div>
				</div>
			</div>
		);
	}

	saveCustomTextures() {
		const { appState } = this.props;

		const ok = () => {
			Textures.saveCustomTextures();
			appState.handleDismissModal();
			appState.handleCustomTextures();
		}

		appState.handleCustomTextureChecking();
		Textures.checkCustomTextures(ok, appState.handleCustomTextureError);
	}

	renderCustomTextures() {
		const { appState } = this.props;

		return (
			<div className="container grid-sm panel">
				<div className="panel-header">
					<div className="panel-title h5">TagPro VCR Custom Textures</div>
				</div>
				<div className="panel-body">
					<form className="form-horizontal">
						{Textures.renderCustomTextureInput("tiles", "Tiles", { imagewidth: 640, imageheight: 440 })}
						{Textures.renderCustomTextureInput("speedpad", "Speedpad", { imagewidthatleast: 80, imagewidthmultipleof: 40, imageheight: 40 })}
						{Textures.renderCustomTextureInput("speedpadRed", "Speedpad (Red)", { imagewidthatleast: 80, imagewidthmultipleof: 40, imageheight: 40 })}
						{Textures.renderCustomTextureInput("speedpadBlue", "Speedpad (Blue)", { imagewidthatleast: 80, imagewidthmultipleof: 40, imageheight: 40 })}
						{Textures.renderCustomTextureInput("portal", "Portal", { imagewidthatleast: 80, imagewidthmultipleof: 40, imageheight: 40 })}
						{Textures.renderCustomTextureInput("portalRed", "Portal (Red)", { imagewidthatleast: 80, imagewidthmultipleof: 40, imageheight: 40 })}
						{Textures.renderCustomTextureInput("portalBlue", "Portal (Blue)", { imagewidthatleast: 80, imagewidthmultipleof: 40, imageheight: 40 })}
						{Textures.renderCustomTextureInput("splats", "Splats", { imagewidthatleast: 120, imagewidthmultipleof: 120, imageheight: 240 })}
						{Textures.renderCustomTextureInput("gravityWell", "Gravity Well", { imagewidth: 40, imageheight: 40 })}
					</form>
					<p />
					<p className="text-center">
						<button className="btn btn-primary" onClick={this.saveCustomTextures.bind(this)}>Save</button>{' '}
						<button className="btn" onClick={appState.handleCustomTextures}>Cancel</button>
					</p>
				</div>
			</div>
		);
	}

	renderInfo() {
		const { appState } = this.props;

		return (
			<div className="container grid-sm panel">
				<div className="panel-header">
					<div className="panel-title h5">TagPro VCR</div>
				</div>
				<div className="panel-body">
					<h6>Usage</h6>
					<ol>
						<li>
							Install the userscript:{' '}
							<a href="https://bash-tp.github.io/tagpro-vcr/tagpro-vcr.user.js">tagpro-vcr.user.js</a>.
						</li>
						<li>
							Play a game of <a href="http://tagpro.gg">TagPro</a>.
						</li>
						<li>
							Upload the recorded game here ({this.renderUploadLabel()}) and click{' '}
							{this.renderStartButton()}.
						</li>
					</ol>
					<h6>Notes</h6>
					<ul>
						<li>
							To test your TagPro userscripts here, add this @include:<br />
							<code>// @include https://bash-tp.github.io/tagpro-vcr/game*.html</code>
						</li>
						<li>
							The game is running in "spectator"-mode, so you can press <code>C</code> to center the view,
							<code>+</code>/<code>-</code> to zoom in/out etc.
							(see <a href="https://www.reddit.com/r/TagPro/wiki/gameplay#wiki_spectator">wiki</a>).
						</li>
					</ul>
					<h6>Texture Pack Selection</h6>
					<p>See <a href="https://tagpro.koalabeast.com/textures/">game</a> for available texture packs.</p>
					<div>{Textures.renderTextureSelect()}</div>
					<p />
					<p className="text-center">
						<button className="btn" onClick={appState.handleCustomTextures}>Use Custom Textures</button>{' '}
						<button className="btn" onClick={appState.handleSettings}>More Settings</button>
					</p>
				</div>
			</div>
		);
	}

	renderModals() {
		const { appState } = this.props;

		const okButton = (
			<button className="btn btn-primary close-modal"
				onClick={appState.handleDismissModal}>Ok</button>
		);

		const textureCheckingModal =
			<Modal
				title="Please Wait"
				body="Validating..."
				stateVar={appState.modal === Modals.TEXTURE_CHECKING}
			/>;

		const textureBadModal =
			<Modal
				title="Invalid Texture"
				body={appState.customTextureError}
				stateVar={appState.modal === Modals.TEXTURE_BAD}
				closeHandler={appState.handleDismissModal}
				actionButton={okButton}
			/>;

		const failedModal =
			<Modal
				title="Invalid Recording"
				body="This file does not contain a valid TagPro VCR recording."
				stateVar={appState.modal === Modals.FAILED}
				closeHandler={appState.handleDismissModal}
				actionButton={okButton}
			/>;

		const forbiddenModal =
			<Modal
				title="Forbidden"
				body="Unable to load recordings from this URL."
				stateVar={appState.modal === Modals.FORBIDDEN}
				closeHandler={appState.handleDismissModal}
				actionButton={okButton}
			/>;

		const loadingModal =
			<Modal
				title="Please Wait"
				body="Loading..."
				stateVar={appState.modal === Modals.FETCHING}
			/>;

		const launchModal =
			<Modal
				title="Ready to Play"
				body="Your recording has been loaded and is ready to play."
				stateVar={appState.modal === Modals.LAUNCH}
				closeHandler={appState.handleDismissModal}
				actionButton={this.renderStartButton()}
			/>;

		const renderTimer = () => {
			if (appState.modal !== Modals.RENDERING) return null;

			return (
				<ProgressTimer
					percentage={appState.renderPercent}
					initialText=""
					completedText="Done"
					decreaseTime={false}
					calculateByAverage={true}
					formatter={(time: number) => { return (appState.renderPercent >= 25) ? timeFormat(time) : "" }}
					// @ts-ignore
					rollingAverageWindowSize={100}
				/>
			);
		}

		const renderingProgress =
			<div className="progress">
				<Circle
					percent={appState.renderPercent}
					trailWidth={3} strokeWidth={5} strokeLinecap="butt"
					strokeColor="#4240d4"
				/>
				<p style={{ textAlign: "center" }}>
					{renderTimer()}
				</p>
			</div>;

		const renderingModal =
			<Modal
				title="Generating Video"
				body={renderingProgress}
				stateVar={appState.modal === Modals.RENDERING}
			/>;

		return (
			<div>
				{textureCheckingModal}
				{textureBadModal}
				{failedModal}
				{forbiddenModal}
				{loadingModal}
				{launchModal}
				{renderingModal}
			</div>
		);
	}

	renderUploadLabel(label?: string) {
		return (
			<label htmlFor="file" className="btn btn-link">
				<i className="icon icon-upload" /> {label || 'Upload recording'}
			</label>
		);
	}

	renderStartButton() {
		const { appState } = this.props;

		return (
			<button
				className={classnames('btn btn-success', {
					disabled: appState.started || !appState.recording
				})}
				onClick={appState.handleStart}
			>
				Play
			</button>
		);
	}

	renderCaptureButtonChrome() {
		const { appState } = this.props;

		return (
			<span>
				<button
					className="btn space-left capture-outer" type="button"
					data-state={appState.capturing ? "capture-active" : "capture-inactive"}
					title={appState.capturing ? "Stop capturing and save video" : "Capture video file"}
					onClick={appState.handleCapture}
				>
					<div className="capture-inner" />
				</button>
				<span className="capture-timer">
					{appState.capturing ? timeFormat(performance.now() - appState.captureStarted) : ""}
				</span>
			</span>
		);
	}

	renderCaptureButtonNonChrome() {
		return (
			<span>
				<button
					className="btn space-left capture-outer tooltip tooltip-right" type="button"
					data-state="capture-inactive"
					data-tooltip="Video capture is only available in Chrome"
					disabled
				>
					<div className="capture-inner" />
				</button>
			</span>
		)
	}

	renderNavbarStopped() {
		const { appState } = this.props;

		const fetchClasses = classnames('form-icon', 'icon', {
			'loading': appState.fetching,
			'icon-check': appState.recordingURL && !appState.fetching && appState.urlIsValid === true,
			'icon-stop': appState.recordingURL && appState.urlIsValid === false
		});

		return (
			<div className="form-horizontal">
				{this.renderUploadLabel(appState.recordingName)}

				<span> or </span>

				<div className={classnames('input-group input-inline', { 'has-icon-right': !!appState.recordingURL })}>
					<input className="form-input" type="text" value={appState.recordingURL} onChange={appState.handleUrlChange} placeholder="Fetch from URL (http://...)" />
					{appState.recordingURL && <i className={fetchClasses} />}
				</div>
				<input id="file" type="file" accept=".ndjson,.ndjson.gz,.jsonl,.jsonl.gz" onChange={appState.handleFileSelect} />{' '}

				{this.renderStartButton()}
			</div>
		);
	}

	renderNavbarLoading() {
		return (
			<div className="form-horizontal">
				Loading...
			</div>
		);
	}

	renderNavbarPlaying() {
		const { appState } = this.props;

		const fmt = (t: number) => {
			if (appState.initialState === TagPro.State.NotStarted && t < appState.startPacket[0]) {
				return '-' + timeFormat(appState.firstTimePacket[2].time - (t - appState.firstTimePacket[0]));
			} else if (appState.overtimePacket && t >= appState.overtimePacket[0]) {
				return timeFormat(appState.overtimePacket[2].time + (t - appState.overtimePacket[0])) + " OT";
			} else {
				return timeFormat(appState.startPacket[2].time - (t - appState.startPacket[0]));
			}
		};

		const { Handle } = Slider;
		const handle = props => {
			const { value, dragging, index, ...restProps } = props;

			return (
				<SliderTooltip
					prefixCls="rc-slider-tooltip"
					overlay={fmt(value)}
					visible={dragging}
					placement="top"
					key={index}
				>
					<Handle value={value} {...restProps} />
				</SliderTooltip>
			);
		};

		return (
			<div className="form-horizontal">
				<span className="control">
					<button
						className="btn jump" type="button"
						data-jump="-10" title="Jump back 10 seconds"
						disabled={appState.finished}
						onClick={appState.handleJump}
					>&laquo;</button>
					{' '}
					<Slider
						min={appState.minTS} max={appState.maxTSSeek}
						value={appState.sliderTS} defaultValue={appState.minTS}
						handle={handle}
						disabled={appState.finished}
						onChange={appState.handleSlider}
						onAfterChange={appState.handleSeek}
					/>
					{' '}
					<button
						className="btn jump" type="button"
						data-jump="10" title="Jump forward 10 seconds"
						disabled={appState.finished}
						onClick={appState.handleJump}
					>&raquo;</button>
					{' '}
					<button
						className="btn space-left" type="button"
						data-state={appState.finished ? "reload" : appState.paused ? "play" : "pause"}
						title={appState.finished ? "Restart playback" : appState.paused ? "Continue playback" : "Pause playback"}
						onClick={appState.handleButton}
					/>
					{' '}
					<button
						className="btn" type="button"
						data-state="stop"
						title="Stop playback"
						onClick={appState.handleStop}
					/>
					{' '}
					{appState.canCapture ? this.renderCaptureButtonChrome() : this.renderCaptureButtonNonChrome() }
				</span>
			</div>
		);
	}

	render() {
		const { appState } = this.props;

		return (
			<div id="container">
				<header id="header" className="navbar">
					<section className="navbar-section">
						<span>TagPro VCR</span>
					</section>
					<section className="navbar-center">
						{appState.started ? (appState.playing ? this.renderNavbarPlaying() : this.renderNavbarLoading()) : this.renderNavbarStopped()}
					</section>
					<section className="navbar-section">
						<a href="https://github.com/bash-tp/tagpro-vcr" className="btn">
							GitHub
						</a>
					</section>
				</header>
				{this.renderModals()}

				<div id="game-container">
					{
						appState.started ? this.renderGame() :
						appState.settings ? this.renderSettings() :
						appState.customTextures ? this.renderCustomTextures() :
						this.renderInfo()
					}
				</div>
			</div>
		);
	}
});

function timeFormat(time: number) {
	return new Date(time).toISOString().substr(14, 5);
}
