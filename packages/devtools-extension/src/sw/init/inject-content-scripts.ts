/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
const contentScriptsToInject: chrome.scripting.RegisteredContentScript[] =
	[
		// This script proxies messages from content scripts running in MAIN world
		// to the extension's service worker
		{
			id: '@v4fire/devtools-extension/proxy',
			js: ['proxy.js'],
			matches: ['<all_urls>'],
			persistAcrossSessions: true,
			runAt: 'document_end',
			world: 'ISOLATED'
		},

		// This script detects the V4Fire and updates the extension tray
		{
			id: '@v4fire/devtools-extension/detect',
			js: ['detect.js'],
			matches: ['<all_urls>'],
			persistAcrossSessions: true,
			runAt: 'document_end',
			world: 'MAIN'
		}
	];

(async () => {
	try {
		// Using this, instead of filtering registered scrips with `chrome.scripting.getRegisteredScripts`
		// because of https://bugs.chromium.org/p/chromium/issues/detail?id=1393762
		// This fixes registering proxy content script in incognito mode
		await chrome.scripting.unregisterContentScripts();

		// Note: the "world" option in registerContentScripts is only available in Chrome v102+
		// It's critical since it allows us to directly run scripts on the "main" world on the page
		await chrome.scripting.registerContentScripts(contentScriptsToInject);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error);
	}
})();
