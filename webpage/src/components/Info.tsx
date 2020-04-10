import { observer } from 'mobx-react';
import * as React from 'react';
import styled from 'styled-components';

import { useAppState } from '../stores/useAppState';
import { StartButton } from './StartButton';
import { UploadLabel } from './UploadLabel';

const VCR_URL = process.env.VCR_URL;

const StyledRoot = styled.div`
	max-width: 800px;
	width: 100%;

	li {
		line-height: 2;
	}
`;

export const Info = observer(function Info() {
	const appState = useAppState();

	return (
		<StyledRoot>
			<details open>
				<summary>Usage</summary>
				<ol>
					<li>
						Install the VCR userscript: <a href={`${VCR_URL}/tagpro-vcr.user.js`}>tagpro-vcr.user.js</a>.
					</li>
					<li>
						Play a game of{' '}
						<a href="http://tagpro.gg" target="_blank" rel="noopener noreferrer">
							TagPro
						</a>
						.
					</li>
					<li>
						Upload the recorded game here (<UploadLabel />) and click {<StartButton />}.
					</li>
				</ol>

				<p>
					Try it with a sample recording:{' '}
					<a href="#" onClick={appState.handleDemoClick}>
						Example 1
					</a>
					.
				</p>
			</details>

			<details open>
				<summary>Notes</summary>
				<ul>
					<li>
						To test your TagPro userscripts here, add this @include:
						<br />
						<code>// @include {process.env.VCR_URL}/game.html</code>
					</li>
					<li>
						The game is running in &quot;spectator&quot;-mode, so you can press <kbd>C</kbd> to center the
						view,
						<kbd>+</kbd>/<kbd>-</kbd> to zoom in/out etc. (see{' '}
						<a href="https://www.reddit.com/r/TagPro/wiki/gameplay#wiki_spectator">TagPro wiki</a>)
					</li>
					<li>
						The VCR webpage stores the last recording you&apos;ve uploaded in your browser&apos;s local
						storage.
					</li>
				</ul>
			</details>
		</StyledRoot>
	);
});
