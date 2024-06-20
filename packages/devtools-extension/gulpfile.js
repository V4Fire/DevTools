/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
'use strict';

// eslint-disable-next-line @v4fire/require-jsdoc
module.exports = function init(gulp = require('gulp')) {
	require('@v4fire/client/gulpfile')(gulp);
	include('build/gulp/zip.js')(gulp);
	globalThis.callGulp(module);
};

module.exports();
