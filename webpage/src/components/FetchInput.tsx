import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { useAppState } from '../stores/useAppState';

const StyledFetch = styled.div`
	display: flex;
	flex: 1;
	align-items: baseline;

	input {
		flex: 1;
	}

	.icon {
		width: 30px;
	}
`;

export const FetchInput = observer(function FetchInput() {
	const appState = useAppState();

	return (
		<StyledFetch>
			<input
				type="text"
				value={appState.recordingURL}
				onChange={appState.handleUrlChange}
				placeholder="Fetch from URL (http://...)"
			/>
			<div className="icon" title={appState.fetchTitle}>
				{appState.fetchIcon}
			</div>
		</StyledFetch>
	);
});
