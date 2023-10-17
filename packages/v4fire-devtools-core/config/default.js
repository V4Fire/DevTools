/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

'use strict';

const
	path = require('upath');

const
	config = require('@v4fire/client/config/default'),
	o = require('@v4fire/config/options').option;

module.exports = config.createConfig({dirs: [__dirname, 'client']}, {
	__proto__: config,

	api: {
		proxy() {
			return o('api-proxy', {
				env: true,
				type: 'boolean',
				default: true
			});
		},

		proxyUrlValue: o('proxy-url-value', {
			env: true,
			default: '/api-proxy'
		}),

		proxyUrl() {
			return this.proxy() ? this.proxyUrlValue : null;
		}
	},

	/**
	 * Returns parameters for a TypeScript compiler:
	 *
	 * 1. server - options for compiling the app as a node.js library;
	 * 2. client - options for compiling the app as a client app.
	 *
	 * @override
	 * @returns {{server: object, client: object}}
	 */
	typescript() {
		const {client, server} = super.typescript();

		// Make path absolute so that ts-loader can correctly load the config file
		client.configFile = path.join(this.src.cwd(), client.configFile);

		return {
			client,
			server
		};
	},

	runtime() {
		return {
			...super.runtime(),
			debug: false
		};
	}
});
