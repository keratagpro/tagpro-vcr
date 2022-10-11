import fs from 'fs';
import template from 'lodash.template';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import styles from "rollup-plugin-styles";
import typescript from 'rollup-typescript';

const { version } = require('./package.json');

const plugins = [
	resolve({
		jsnext: true,
		browser: true
	}),
	commonjs(),
	typescript(),
	styles(),
	replace({
		VCR_VERSION: version,
		VCR_URL: 'https://bash-tp.github.io/tagpro-vcr/'
		// VCR_URL: 'http://localhost:8080/'
	})
];

if (!fs.existsSync('../docs')) {
	fs.mkdirSync('../docs');
}

const meta = renderTemplate('src/templates/meta.tpl.js', { version });
fs.writeFileSync('../docs/tagpro-vcr.meta.js', meta, 'utf8');

const globals = {
	idb: 'idb',
	penpal: 'Penpal',
	tagpro: 'tagpro',
	tagproConfig: 'tagproConfig'
};

export default [
	{
		input: 'src/index.ts',
		output: {
			file: '../docs/tagpro-vcr.user.js',
			format: 'iife',
			banner: meta,
			globals
		},
		external: Object.keys(globals),
		plugins
	}
];

function renderTemplate(filename, data = undefined) {
	const content = fs.readFileSync(filename);
	const tpl = template(content);
	return tpl(data);
}
