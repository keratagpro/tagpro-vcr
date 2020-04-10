import { observer } from 'mobx-react';
import * as React from 'react';

// import { Button } from '../elements/Button';
import { useAppState } from '../stores/useAppState';
// import { Settings } from './Settings';
import { StartButton } from './StartButton';
import { StopButton } from './StopButton';
import { UploadLabel } from './UploadLabel';

export const Header = observer(function Header() {
	const appState = useAppState();

	return (
		<header>
			<div className="form-upload">
				<UploadLabel />
				<span> or&nbsp;&nbsp; </span>
				<div className="form-fetch">
					<input
						type="text"
						className="recording-url-input"
						value={appState.recordingURL}
						onChange={appState.handleUrlChange}
						placeholder="Fetch from URL (http://...)"
					/>
					<div className="form-fetch-icon" title={appState.fetchTitle}>
						{appState.fetchIcon}
					</div>
				</div>
				<StartButton />
				<StopButton />
				{/* <Button onClick={() => appState.toggleSettings()}>⚙️</Button> */}
				{/* <Settings /> */}
			</div>
		</header>
	);
});
