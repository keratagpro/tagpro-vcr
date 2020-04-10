import * as React from 'react';
import styled from 'styled-components';

import { FetchInput } from './FetchInput';
import { SettingsButton } from './SettingsButton';
import { SettingsDialog } from './SettingsDialog';
import { StartButton } from './StartButton';
import { StopButton } from './StopButton';
import { UploadLabel } from './UploadLabel';

const StyledHeader = styled.header`
	width: 100%;
	max-width: 800px;
	margin: 20px auto;

	display: flex;
	align-items: baseline;
`;

export function Header() {
	return (
		<StyledHeader>
			<UploadLabel />
			<span> or&nbsp; </span>
			<FetchInput />
			<StartButton />
			<StopButton />
			<SettingsButton />
			<SettingsDialog />
		</StyledHeader>
	);
}
