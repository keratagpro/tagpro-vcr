import createDebug from 'debug';
import tagpro from 'tagpro';

import * as utils from './utils';
import BasicRecorder from './utils/BasicRecorder';
import { isFrontPage, isInGame, readyAsync } from './utils/tagpro';

const debug = createDebug('vcr');
debug.enabled = true;

(async function() {
	await readyAsync(tagpro);

	if (isInGame(tagpro)) {
		debug('Recording.');
		startRecording(tagpro);
	} else if (isFrontPage()) {
		debug('Injecting link to VCR.');
		utils.addLinkToVcr();
	} else {
		debug('Not in game.');
	}
})();

function startRecording(tp: TagPro) {
	const recorder = new BasicRecorder();

	const metadata = {
		server: location.hostname,
		port: location.port,
		time: Date.now(),
		tagproVersion: tp.version
	};

	recorder.record(utils.now(), 'recorder-metadata', metadata);

	// NOTE: removing $ prefix.
	const events = Object.keys(tp.rawSocket['_callbacks']).map(e => (e.startsWith('$') ? e.substr(1) : e));

	const listeners = utils.addPacketListeners(tp.rawSocket, events, recorder.record.bind(recorder));

	window.addEventListener('beforeunload', async function(ev) {
		listeners.cancel();

		const data = await recorder.end();
		utils.saveFile(data, `tagpro-recording-${Date.now()}.ndjson`);
	});
}
