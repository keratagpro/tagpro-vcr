import classnames from 'classnames';
import { observer } from 'mobx-react';
import * as React from 'react';

import Slider, { SliderTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css'

import { AppState } from '../stores/AppState';
import * as ProfileSettings from '../utils/ProfileSettings';
import * as Textures from '../utils/Textures';

import './App.css';

interface IProps {
	appState: AppState;
}

export const App = observer(class AppClass extends React.Component<IProps> {
	renderGame() {
		const { appState } = this.props;

		const eggBall = appState.isEggBall();
		const gameSrc = eggBall ? "game-egg.html" : "game.html";

		return <iframe id="game-frame" src={gameSrc} frameBorder="0" />;
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
					<h6>Settings</h6>
					<div className="columns">
						<div className="column col-6">
							{ProfileSettings.renderProfileCheckbox('disableBallSpin', 'Enable Ball Spin', false)}<br />
							{ProfileSettings.renderProfileCheckbox('disableParticles', 'Enable Particle Effects', false)}<br />
							{ProfileSettings.renderProfileCheckbox('forceCanvasRenderer', 'Enable WebGL Rendering', false)}<br />
							{ProfileSettings.renderProfileCheckbox('disableViewportScaling', 'Enable Viewport Scaling', true)}<br />
							{ProfileSettings.renderProfileCheckbox('vcrHidePerformanceInfo', 'Show FPS', false)}
						</div>
						<div className="column col-6">
							Tile Respawn Warnings:<br />
							{ProfileSettings.renderTileRespawnSelect()}
						</div>
					</div>
				</div>
				<div className={`modal modal-sm ${appState.failed ? 'active' : ''}`}>
					<div className="modal-overlay"></div>
					<div className="modal-container">
						<div className="modal-header">
							<button className="btn btn-clear float-right close-modal" onClick={appState.handleFailed}></button>
							<div className="modal-title"><b>Invalid Recording</b></div>
						</div>
						<div className="modal-body">
							<div className="content">
								<p>This file does not contain a valid TagPro VCR recording.</p>
							</div>
						</div>
						<div className="modal-footer">
							<button className="btn btn-primary close-modal" onClick={appState.handleFailed}>Ok</button>
						</div>
					</div>
				</div>
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

	renderNavbarStopped() {
		const { appState } = this.props;

		return (
			<div className="form-horizontal">
				{this.renderUploadLabel(appState.recordingName)}
				<input id="file" type="file" accept=".ndjson,.jsonl" onChange={appState.handleFileSelect} />{' '}

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
					<Slider
						min={appState.minTS} max={appState.maxTS-(appState.maxTS % 1000)}
						value={appState.currentTS} defaultValue={appState.minTS}
						handle={handle}
						disabled={appState.finished}
						onChange={appState.handleSlider}
						onAfterChange={appState.handleSeek}
					/>
					{' '}
					<button
						className="btn" type="button"
						data-state={appState.finished ? "reload" : appState.paused ? "play" : "pause"}
						onClick={appState.handleButton}
					/>
					{' '}
					<button
						className="btn" type="button"
						data-state="stop"
						onClick={appState.handleStop}
					/>
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

				<div id="game-container">{appState.started ? this.renderGame() : this.renderInfo()}</div>
			</div>
		);
	}
});

function timeFormat(time: number) {
	return new Date(time).toISOString().substr(14, 5);
}
