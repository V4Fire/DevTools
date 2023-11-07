/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

'use strict';

const
	config = require('@v4fire/devtools-core/config/default'),
	o = require('@v4fire/config/options').option;

module.exports = config.createConfig({dirs: [__dirname, 'client']}, {
	__proto__: config,

	/**
	 * Extension manifest version
	 *
	 * @cli extension-manifest-version
	 * @env EXTENSION_MANIFEST_VERSION
	 */
	extensionManifestVersion: o('extension-manifest-version', {
		env: true,
		default: '3',
		validate(value) {
			return ['2', '3'].includes(value);
		}
	}),

	/**
	 * Extension version
	 * @returns {string}
	 */
	version() {
		return o('version', {
			default: include('package.json').version,
			env: false
		});
	},

	webpack: {
		externalizeInline() {
			return super.externalizeInline(true);
		}
	}
});
