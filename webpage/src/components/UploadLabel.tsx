import * as React from 'react';
import { observer } from 'mobx-react';

import FileInput from '../elements/FileInput';
import useAppState from '../stores/useAppState';
import { Button } from '../elements/Button';

interface Props {
	label?: string;
}

export default observer(function UploadLabel({ label }: Props) {
	const appState = useAppState();

	return (
		<Button as="label">
			📤 {label || 'Upload recording'}
			<FileInput onChange={appState.handleFileSelect} />
		</Button>
	);
});
