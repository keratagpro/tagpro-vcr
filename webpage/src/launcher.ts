import { connectToParent } from 'penpal';

const allowedDomains =
	[
		'koalabeast.com',
		'jukejuice.com',
		'newcompte.fr'
	]
	.join('|');

	const connection = connectToParent({
	methods: {
		game(data: string, filename: string) {
			localStorage.setItem('recording', data);
			localStorage.setItem('recordingName', filename);
			return true;
		}
	},
	parentOrigin: new RegExp(`^https?://(.+\\.)?(${allowedDomains})(:[0-9]+)?$`)
});
