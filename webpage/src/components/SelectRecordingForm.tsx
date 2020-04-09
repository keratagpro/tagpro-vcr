import { observer } from 'mobx-react';
import * as React from 'react';

import { useAppState } from '../stores/useAppState';
import { UploadLabel } from './UploadLabel';
import { StartButton } from './StartButton';
import { StopButton } from './StopButton';

export const SelectRecordingForm = observer(function SelectRecordingForm() {
	const appState = useAppState();

	return (
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
		</div>
	);
});
