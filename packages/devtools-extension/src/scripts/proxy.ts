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

globalThis.addEventListener('pageshow', () => {
	globalThis.addEventListener('message', handleMessageFromPage);
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
		case 'v4fire-devtools-detect': {
			const {source, payload} = event.data;
			void chrome.runtime.sendMessage({source, payload});

			break;
		}

		default:
			// Do nothing
	}
}
