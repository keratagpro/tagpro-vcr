// @ts-check
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const VCR_URL = 'https://keratagpro.github.io/tagpro-vcr';
// const VCR_URL = 'http://localhost:8080';

/** @type {webpack.Configuration} */
const common = {
	devtool: 'cheap-source-map',
	output: {
		path: path.resolve(__dirname, '../docs'),
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json'],
	},
	module: {
		rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }],
	},
	node: false,
};

/** @type {webpack.Configuration} */
const configMain = {
	...common,
	entry: {
		main: './src/index.tsx',
		game: './src/game.tsx',
	},
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
		},
	},
	plugins: [new webpack.EnvironmentPlugin({ VCR_URL }), new CopyPlugin([{ from: 'assets' }])],
	devServer: {
		contentBase: path.join(__dirname, '../docs'),
		compress: true,
		port: 4040,
	},
};

/** @type {webpack.Configuration} */
const configWorker = {
	...common,
	entry: {
		worker: './src/worker.ts',
	},
	target: 'webworker',
};

module.exports = [configMain, configWorker];
