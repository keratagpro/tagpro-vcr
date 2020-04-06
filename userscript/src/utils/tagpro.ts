export function isInGame(tagpro: TagPro) {
	return tagpro.state > 0;
}

export function isFrontPage() {
	return !!document.querySelector('#userscript-home');
}

export function getTagPro() {
	return new Promise<TagPro>(function (resolve) {
		waitForTagPro(resolve);
	});
}

export function readyAsync(tagpro: TagPro) {
	return new Promise<TagPro>((resolve) => tagpro.ready(resolve));
}

export function getTagProReady() {
	return getTagPro().then((tagpro) => readyAsync(tagpro).then(() => tagpro));
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
