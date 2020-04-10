import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { Button } from '../elements/Button';
import { FileInput } from '../elements/FileInput';
import { useAppState } from '../stores/useAppState';

const Label = styled(Button).attrs({ as: 'label' })`
	white-space: nowrap;
	max-width: 200px;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export const UploadLabel = observer(function UploadLabel() {
	const appState = useAppState();

	return (
		<Label title={appState.recordingName}>
			📤 {appState.recordingName || 'Upload recording'}
			<FileInput onChange={appState.handleFileSelect} />
		</Label>
	);
});
