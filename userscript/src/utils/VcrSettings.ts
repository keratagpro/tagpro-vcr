import tagproConfig from 'tagproConfig';

interface Settings {
	enabled: boolean,
	skipSpectator: boolean,
	skipShort: boolean,
	download: boolean,
	save: number,
	shortSeconds: number,
	welcome: string
}

export type Action = () => void;

function cookieName(name: string) {
	return 'vcr' + name.charAt(0).toUpperCase() + name.slice(1);
}

export class VcrSettings {
	private settings: Settings = {
		enabled: true,
		skipSpectator: true,
		skipShort: true,
		download: false,
		save: 10,
		shortSeconds: 10,
		welcome: ''
	}

	constructor() {
		Object.keys(this.settings).forEach(name => {
			// Note: $.cookie returns only string values because
			// the homepage doesn't set $.cookie.json

			const cookie = $.cookie(cookieName(name));

			if (typeof cookie !== 'undefined') {
				try {
					this.settings[name] = JSON.parse(cookie);
				} catch {
					this.settings[name] = cookie;
				}
			}
		});
	}

	get<T extends keyof Settings>(name: T): Settings[T] {
		return this.settings[name];
	}

	set<T extends keyof Settings>(name: T, value: Settings[T]) {
		$.cookie(cookieName(name), String(value), { expires: 36500, path: '/', domain: tagproConfig.cookieHost });
		this.settings[name] = value;
	}

	checkbox<T extends keyof Settings>(name: T, label: string, actionList: Action[]) {
		const checked = this.get(name) ? "checked" : "";
		const id = `vcrCheckbox_${name}`;

		actionList.push(() => {
			document.querySelector(`#${id}`).addEventListener('click', this.checkboxHandler.bind(this));
		});

		return /*html*/`
			<input id="${id}" type="checkbox" name="${name}" ${checked} /><label class="checkbox-inline" for="${id}">${label}</label>
		`;
	}

	private checkboxHandler(ev: MouseEvent) {
		const target = ev.target as HTMLInputElement;
		const name = target.name as keyof Settings;

		this.set(name, target.checked);
	}

	radio<T extends keyof Settings>(name: T, label: string, value: Settings[T], actionList: Action[]) {
		const checked = this.get(name) === value ? "checked" : "";
		const id = `vcrRadio_${name}_${value}`

		actionList.push(() => {
			document.querySelector(`#${id}`).addEventListener('click', this.radioHandler.bind(this));
		});

		return /*html*/`
			<input id="${id}" type="radio" name="${name}" value="${value}" ${checked} /><label class="radio-inline" for="${id}">${label}</label>
		`;
	}

	private radioHandler(ev: MouseEvent) {
		const target = ev.target as HTMLInputElement;
		const name = target.name as keyof Settings;
		const value = target.value;

		this.set(name, value);
	}

	select<T extends keyof Settings>(name: T, values: Settings[T][], actionList: Action[]) {
		const value = this.get(name);
		const id = `vcrSelect_${name}`;

		actionList.push(() => {
			document.querySelector(`#${id}`).addEventListener('change', this.selectHandler.bind(this));
		});

		let select = /*html*/`
			<select id="${id}" name="${name}" class="vcr-select">
		`;

		values.forEach(v => {
			const selected = v === value ? "selected" : "";

			select += /*html*/`
				<option value="${v}" ${selected}>${v}</option>
			`;
		})

		select += /*html*/`
			</select>
		`;

		return select;
	}

	private selectHandler(ev: MouseEvent) {
		const target = ev.target as HTMLSelectElement;
		const name = target.name as keyof Settings;
		const value = target.selectedOptions[0].value;

		this.set(name, value);
	}
}
