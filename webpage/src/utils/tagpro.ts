export function getTagPro() {
	return new Promise<TagPro>(function (resolve) {
		waitForTagPro(resolve);
	});
}

function waitForTagPro(cb: (tp: TagPro) => void) {
	if (typeof window.tagpro !== 'undefined') {
		cb(window.tagpro);
	} else {
		setTimeout(function () {
			waitForTagPro(cb);
		}, 100);
	}
}

export function isInGame(tagpro: TagPro) {
	return tagpro.state > 0;
}
