import tagproConfig from 'tagproConfig';

const vcrEnabled = 'vcrEnabled';
const vcrSkipSpectator = 'vcrSkipSpectator';
const vcrSkipShort = 'vcrShort';
const vcrDownload = 'vcrDownload';
const vcrWelcome = 'vcrWelcome';

export default class VcrSettings {
	private _enabled = true;
	private _skipSpectator = true;
	private _skipShort = true;
	private _download = false;
	private _save = 10;
	private _shortSeconds = 10;
	private _welcome = '';

	private getCookieBoolean(name: string, dflt: boolean) {
		const cookie = $.cookie(name);
		return cookie === 'true' ? true : cookie === 'false' ? false : dflt;
	}

	private getCookieString(name: string, dflt: string) {
		const cookie = $.cookie(name);
		return cookie ?? dflt;
	}

	private setCookie(name: string, value: any) {
		$.cookie(name, String(value), { expires: 36500, path: '/', domain: tagproConfig.cookieHost });
	}

	constructor() {
		this._enabled = this.getCookieBoolean(vcrEnabled, this._enabled);
		this._skipSpectator = this.getCookieBoolean(vcrSkipSpectator, this._skipSpectator);
		this._skipShort = this.getCookieBoolean(vcrSkipShort, this._skipShort);
		this._download = this.getCookieBoolean(vcrDownload, this._download);
		this._welcome = this.getCookieString(vcrWelcome, this._welcome);
	}

	get enabled() { return this._enabled; }
	set enabled(enabled: boolean) { this.setCookie(vcrEnabled, enabled); this._enabled = enabled; }

	get skipSpectator() { return this._skipSpectator }
	set skipSpectator(skipSpectator: boolean) { this.setCookie(vcrSkipSpectator, skipSpectator); this._skipSpectator = skipSpectator; }

	get skipShort() { return this._skipShort }
	set skipShort(skipShort: boolean) { this.setCookie(vcrSkipShort, skipShort); this._skipShort = skipShort; }

	get download() { return this._download; }
	set download(download: boolean) { this.setCookie(vcrDownload, download); this._download = download; }

	get save() { return this._save; }

	get shortSeconds() { return this._shortSeconds; }

	get welcome() { return this._welcome; }
	set welcome(version: string) { this.setCookie(vcrWelcome, version); this._welcome = version; }
}
