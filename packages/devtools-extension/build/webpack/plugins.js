/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
'use strict';

const
	path = require('path'),
	CopyPlugin = require('copy-webpack-plugin');

const
	parent = include('@super/build/webpack/plugins', __dirname),
	ExtensionManifestPlugin = require('./plugins/extension-manifest');

/**
 * Init webpack plugins
 *
 * @param {object} root0
 * @returns {Map}
 */
module.exports = async function plugins({buildId, name}) {
	const plugins = new Map(await parent({buildId, name}));

	plugins.set('copy-icons', new CopyPlugin({
		patterns: [{from: 'src/assets/icons', to: 'assets/icons'}]
	}));

	plugins.set('extension-manifest-plugin', new ExtensionManifestPlugin({
		manifestTemplatePath: path.resolve('manifest.template.json'),
		manifestV2TemplatePath: path.resolve('manifest.v2.template.json')
	}));

	return plugins;
};
