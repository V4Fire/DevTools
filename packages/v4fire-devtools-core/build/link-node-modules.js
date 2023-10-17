/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

'use strict';

// NOTE: creates symlink to the node_modules in workspace root,
// this helps pzlr to correctly resolve paths
const
	path = require('upath'),
	fs = require('node:fs');

const linkPath = path.resolve(__dirname, '../node_modules');
if (!fs.existsSync(linkPath)) {
	fs.symlinkSync(path.resolve(__dirname, '../../../node_modules'), linkPath);

}
