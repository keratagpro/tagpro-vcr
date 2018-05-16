import classnames from 'classnames';
import { observer } from 'mobx-react';
import * as React from 'react';

import { AppState } from '../stores/AppState';
import { equals } from '../utils';
import { Modal } from './Modal';

import './App.css';

interface IProps {
	appState: AppState;
}

@observer
export class App extends React.Component<IProps> {
	renderGame() {
		return <iframe id="game-frame" src="game.html" frameBorder="0" />;
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
							<a href="https://keratagpro.github.io/tagpro-vcr/tagpro-vcr.user.js">tagpro-vcr.user.js</a>.
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
							<code>// @include https://keratagpro.github.io/tagpro-vcr/game.html</code>
						</li>
					</ul>
				</div>
			</div>
		);
	}

	renderUploadLabel(label?: string) {
		return (
			<label htmlFor="file" className="btn btn-link">
				<i className="icon icon-upload" /> {label || 'Select recording...'}
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
				Start
			</button>
		);
	}

	renderStopButton() {
		const { appState } = this.props;

		return (
			<button
				className={classnames('btn btn-error', { disabled: !appState.started })}
				onClick={appState.handleStop}
			>
				Stop
			</button>
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
						<div className="form-group">
							<input id="file" type="file" accept=".ndjson,.jsonl" onChange={appState.handleFileSelect} />
							{this.renderUploadLabel(appState.recordingName)} {this.renderStartButton()}{' '}
							{this.renderStopButton()}
						</div>
					</section>
					<section className="navbar-section">
						<a href="https://github.com/keratagpro/tagpro-vcr" className="btn">
							GitHub
						</a>
					</section>
				</header>

				<div id="game-container">{appState.started ? this.renderGame() : this.renderInfo()}</div>
			</div>
		);
	}
}
