/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

'use strict';

// @ts-check

require('sugar').extend();

const
	config = require('@config/config'),
	{api} = config;

const
	createProxyServer = require('./build/proxy-server');

const app = createProxyServer();

module.exports = app.listen(api.port);
console.log('App launched');
console.log(`http://localhost:${api.port}`);
