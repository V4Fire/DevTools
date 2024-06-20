/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

// NOTE: this script runs in ISOLATED world.
// @see: https://chromium.googlesource.com/chromium/src/+/master/third_party/blink/renderer/bindings/core/v8/V8BindingDesign.md#world
// It can forward messages from content scripts running in MAIN world to the extension's service worker.

let port: chrome.runtime.Port | null = null;

globalThis.addEventListener('pageshow', () => {
	globalThis.addEventListener('message', handleMessageFromPage);

	if (port == null) {
		connectPort();
	}
});

globalThis.addEventListener('pagehide', () => {
	globalThis.removeEventListener('message', handleMessageFromPage);
});

function handleMessageFromPage(event: MessageEvent) {
	// eslint-disable-next-line no-restricted-globals
	if (event.source !== window || event.data == null) {
		return;
	}

	switch (event.data.source) {
		// This is a message from a bridge (initialized by a devtools backend)
		case 'v4fire-devtools-bridge':
			port?.postMessage(event.data.payload);
			break;

		// This is a message from a detect script
		case 'v4fire-devtools-detect': {
			const {source, payload} = event.data;
			void chrome.runtime.sendMessage({source, payload});

			break;
		}

		default:
			// Do nothing
	}
}

function handleMessageFromDevtools(message: any) {
	globalThis.postMessage(
		{
			source: 'v4fire-devtools-content-script',
			payload: message
		},
		'*'
	);
}

function handleDisconnect() {
	port = null;

	// Try to reconnect
	connectPort();
}

// Creates port from application page to the V4Fire DevTools' service worker
// Which then connects it with devtools port
function connectPort() {
	port = chrome.runtime.connect({
		name: 'proxy'
	});

	port.onMessage.addListener(handleMessageFromDevtools);
	port.onDisconnect.addListener(handleDisconnect);
}
