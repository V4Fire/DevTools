/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

// NOTE: this script runs in MAIN world
// @see: https://chromium.googlesource.com/chromium/src/+/master/third_party/blink/renderer/bindings/core/v8/V8BindingDesign.md#world

import pageHasV4Fire from 'core/helpers/page-has-v4fire';

const poll = (call: number = 1) => {
	if (pageHasV4Fire()) {
		globalThis.postMessage(
			{source: 'v4fire-devtools-detect'},
			'*'
		);
	} else if (call <= 5) {
		setTimeout(() => poll(call + 1), 500);
	}
};

poll();
