/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

'use strict';

const
	config = require('@v4fire/devtools-core/config/default');

module.exports = config.createConfig({dirs: [__dirname, 'client']}, {
	__proto__: config,

	webpack: {
		externalizeInline() {
			return super.externalizeInline(true);
		}
	}
});
