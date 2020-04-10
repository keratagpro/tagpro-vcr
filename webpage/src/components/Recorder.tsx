import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { useGameState } from '../stores/useGameState';
import { GlobalStyle } from './GlobalStyle';

const StyledRoot = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	z-index: 1;
`;

const Blinker = styled.span<{ blink?: boolean }>`
	animation: ${(p) => p.blink && `blinker 1s linear infinite`};

	@keyframes blinker {
		50% {
			opacity: 0;
		}
	}
`;

export const Recorder = observer(function Recorder() {
	const gameState = useGameState();

	return (
		<StyledRoot>
			<GlobalStyle />
			<button onClick={gameState.toggleRecording}>
				<Blinker blink={gameState.recording}>🔴</Blinker> Record
			</button>
		</StyledRoot>
	);
});
