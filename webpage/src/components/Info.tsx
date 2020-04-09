import { observer } from 'mobx-react';
import * as React from 'react';

import { useAppState } from '../stores/useAppState';
import { StartButton } from './StartButton';
import { UploadLabel } from './UploadLabel';

const VCR_URL = process.env.VCR_URL;

export const Info = observer(function Info() {
	const appState = useAppState();

	return (
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
	);
});
