import { observer } from 'mobx-react';
import * as React from 'react';

import { Button } from '../elements/Button';
import { FileInput } from '../elements/FileInput';
import { useAppState } from '../stores/useAppState';

interface Props {
	label?: string;
}

export const UploadLabel = observer(function UploadLabel({ label }: Props) {
	const appState = useAppState();

	return (
		<Button as="label">
			📤 {label || 'Upload recording'}
			<FileInput onChange={appState.handleFileSelect} />
		</Button>
	);
});
