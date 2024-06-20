/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

'use strict';

const
	headerPlugin = require('eslint-plugin-header');

const
	base = require('@v4fire/linters/eslint.config');

const copyrightTemplate = [
	'!',
	' * V4Fire DevTools',
	' * https://github.com/V4Fire/DevTools',
	' *',
	' * Released under the MIT license',
	' * https://github.com/V4Fire/DevTools/blob/main/LICENSE',
	' '
];

const ignore = [
	'**/src/**/@(i-|b-|p-|g-|v-)*/index.js',
	'**/src/**/test/**/*.js',

	'**/assets/**',
	'**/src/assets/**',

	'**/tmp/**',
	'**/src/entries/tmp/**',

	'**/docs/**',
	'**/dist/**',
	'**/node_modules/**'
];

base.forEach((item) => {
	item.ignores = ignore;

	if (item.plugins) {
		item.plugins['header'] = headerPlugin;
	}

	if (item.rules) {
		item.rules['header/header'] = [2, 'block', copyrightTemplate];
	}
});

module.exports = base;
