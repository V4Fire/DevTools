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

base.forEach((item) => {
	if (item.plugins) {
		item.plugins['header'] = headerPlugin;
	}

	if (item.rules) {
		item.rules['header/header'] = [2, 'block', copyrightTemplate];
	}
});

module.exports = base;
