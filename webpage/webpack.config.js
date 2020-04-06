const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const output = {
	path: path.resolve(__dirname, '../docs'),
};

const resolve = {
	extensions: ['.ts', '.tsx', '.js', '.json'],
};

const modules = {
	rules: [
		{ test: /\.tsx?$/, loader: 'ts-loader' },
		{
			test: /\.css$/,
			use: ['style-loader', 'css-loader'],
		},
	],
};

const optimization = {
	splitChunks: {
		chunks: 'all',
	},
};

/** @type {webpack.Configuration} */
const configMain = {
	devtool: 'cheap-source-map',
	entry: {
		main: './src/index.tsx',
		game: './src/game.tsx',
	},
	output,
	resolve,
	module: modules,
	optimization,
	plugins: [new CopyPlugin([{ from: 'assets' }])],
};

/** @type {webpack.Configuration} */
const configWorker = {
	devtool: 'cheap-source-map',
	entry: {
		worker: './src/worker.ts',
	},
	output,
	resolve,
	module: modules,
	target: 'webworker',
};

module.exports = [configMain, configWorker];
