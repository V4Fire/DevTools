/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

'use strict';

/**
 * Create proxy server for development
 *
 * @param {object} root0
 * @returns {import('express')}
 */
module.exports = function createProxyServer({
	middleWare = []
} = {}) {
	const
		path = require('upath'),
		url = require('url');

	const
		express = require('express'),
		proxy = require('express-http-proxy');

	const
		{src} = config,
		app = express();

	if (api.proxy()) {
		app.use(api.proxyUrl(), proxy(
			({path}) => {
				const
					parts = path.slice(1).split('/'),
					[protocol, host] = parts;

				return `${protocol}://${host}`;
			},

			{
				limit: '10mb',
				filter: ({path}) => /^\/https?\//.test(path),
				proxyReqPathResolver: ({url}) => url.replace(/^\/[^/]+\/[^/]+/, ''),
				proxyReqOptDecorator(proxyReqOpts) {
					proxyReqOpts.rejectUnauthorized = false;
					return proxyReqOpts;
				}
			}
		));
	}

	app.use('/dist/client', express.static(src.clientOutput(), {
		maxAge: process.env.CI ? 86400000 : 0
	}));

	app.use('/assets', express.static(src.assets(), {
		maxAge: process.env.CI ? 86400000 : 0
	}));

	middleWare.forEach((fn) => {
		fn({app});
	});

	app.get('/**', (req, res) => {
		if (!api.proxy() && req.url.includes(api.proxyUrlValue)) {
			return res.sendStatus(404);
		}

		const
			{query} = req;

		if ('token' in query) {
			const
				reqUrl = url.parse(req.url);

			reqUrl.query = Object.toQueryString(Object.reject(query, 'token'));
			reqUrl.search = reqUrl.query;

			res.cookie('token', query.token, {maxAge: (5).minutes(), path: '/'});
			res.redirect(301, url.format(reqUrl));

			return;
		}

		const
			root = path.join(src.clientOutput(), 'p-root.html'),
			demo = path.join(src.clientOutput(), `${config.build.demoPage()}.html`);

		return res.sendFile(config.build.componentsDemo ? demo : root);
	});

	return app;
};
