/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
'use strict';

const
	config = require('@config/config'),
	parent = include('@super/build/webpack/module', __dirname),
	MiniCssExtractPlugin = require('mini-css-extract-plugin');

const
	{inherit} = include('build/helpers');

/**
 * Returns settings for `webpack.module`
 *
 * @param {{buildId: number|string, plugins: Map}} params
 * @returns {Promise<{rules: Map}>}
 */
module.exports = async function module(params) {
	const
		{plugins} = params,
		loaders = await parent(params);

	const
		fileLoader = loaders.rules.get('ess').use.find((usedLoader) => usedLoader.loader === 'file-loader'),
		fileName = fileLoader?.options?.name;

	if (/\.html$/.test(fileName)) {
		fileLoader.options.name = '[name].html';
	}

	plugins.set('extractCSS', new MiniCssExtractPlugin(inherit(config.miniCssExtractPlugin(), {
		filename: '[name].css',
		chunkFilename: '[id].css'
	})));

	return loaders;
};

Object.assign(module.exports, {...parent});
