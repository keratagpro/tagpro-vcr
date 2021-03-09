import Cookies from 'js-cookie';
import React from 'react';
import Select from 'react-select';

const cookieOptions = {
	expires: 36500
};

// Checkboxes:

function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
	Cookies.set(e.target.id, String(!e.target.checked), cookieOptions);
}

export function renderProfileCheckbox(cookieName: string, label: string, defaultValue: boolean) {
	const cookie = Cookies.get(cookieName);
	const initial: boolean =
		cookie === 'true' ? true :
		cookie === 'false' ? false :
		defaultValue;

	// NOTE: the booleans are always inverted. For example:
	// Enable Ball Spin, the cookie name is disableBallSpin.
	// When checked, the cookie value is false, and when unchecked it's true.
	// The defaultValue parameter is the default cookie value, NOT checked.

	return (
		<label>
			<input
				type="checkbox"
				id={cookieName}
				defaultChecked={!initial}
				onChange={handleCheckboxChange}
			/>
			{' '}
			{label}
		</label>
	);
}

// Select for Tile Respawn Warnings:

const respawns = [
	{ label: 'Blink', value: 'blink' },
	{ label: 'Transparent', value: 'alpha' },
	{ label: 'None', value: 'none' }
];

function tileRespawnChange(selection) {
	Cookies.set('tileRespawnWarnings', selection.value, cookieOptions);
}

export function renderTileRespawnSelect() {
	const cookie = Cookies.get('tileRespawnWarnings');
	const initial = respawns.find(r => r.value === cookie) ?? respawns[0];

	return (
		<Select
			defaultValue={initial}
			options={respawns}
			onChange={tileRespawnChange}
			menuPosition="fixed"
		/>
	);
}