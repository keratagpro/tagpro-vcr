import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import fs from 'fs';
import template from 'lodash.template';
import postcss from 'rollup-plugin-postcss';

const { version } = require('./package.json');

const VCR_URL = 'https://keratagpro.github.io/tagpro-vcr';
// const VCR_URL = 'http://localhost:8080';

const plugins = [
	typescript(),
	resolve({ browser: true }),
	commonjs(),
	postcss({
		inject: false,
	}),
	replace({ VCR_URL }),
];

if (!fs.existsSync('../docs')) {
	fs.mkdirSync('../docs');
}

function renderTemplate(filename, data = undefined) {
	const content = fs.readFileSync(filename);
	const tpl = template(content);
	return tpl(data);
}

const meta = renderTemplate('src/templates/meta.tpl.js', {
	version,
	VCR_URL,
});
fs.writeFileSync('../docs/tagpro-vcr.meta.js', meta, 'utf8');

const globals = {
	debug: 'debug',
	tagpro: 'tagpro',
};

/** @type {import('rollup').RollupOptions} */
const config = {
	input: 'src/index.ts',
	output: {
		file: '../docs/tagpro-vcr.user.js',
		format: 'iife',
		banner: meta,
		globals,
		sourcemap: false,
	},
	external: Object.keys(globals),
	plugins,
};

export default config;
