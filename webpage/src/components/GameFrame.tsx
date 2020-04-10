import * as React from 'react';
import styled from 'styled-components';

const StyledRoot = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
	flex: 10;
`;

const StyledIframe = styled.iframe`
	width: 100%;
	height: 100%;
`;

export function GameFrame() {
	return (
		<StyledRoot>
			<StyledIframe id="game-frame" src="game.html" frameBorder="0" />
		</StyledRoot>
	);
}
