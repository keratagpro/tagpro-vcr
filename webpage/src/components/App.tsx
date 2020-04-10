import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { useAppState } from '../stores/useAppState';
import { GameFrame } from './GameFrame';
import { GlobalStyle } from './GlobalStyle';
import { Header } from './Header';
import { Info } from './Info';

const StyledRoot = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const StyledLogo = styled.h1`
	position: absolute;
	top: 0;
	left: 0;
	z-index: -1;
`;

export const App = observer(function App() {
	const appState = useAppState();

	return (
		<StyledRoot>
			<GlobalStyle />

			<StyledLogo>📼 TagPro VCR</StyledLogo>

			<Header />

			{appState.started && <GameFrame />}

			{!appState.started && <Info />}
		</StyledRoot>
	);
});
