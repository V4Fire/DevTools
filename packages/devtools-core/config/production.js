/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

'use strict';

const
	config = include('config/default');

module.exports = config.createConfig({dirs: [__dirname], mod: '@super/config/production'}, {
	__proto__: config
});
