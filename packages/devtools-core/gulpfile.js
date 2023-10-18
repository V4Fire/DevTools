/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

'use strict';

/**
 * Init gulp instance
 *
 * @param {any} gulp
 */
module.exports = (gulp = require('gulp')) => {
	require('@v4fire/client/gulpfile')(gulp);
	globalThis.callGulp(module);
};

module.exports();
