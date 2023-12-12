/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

export interface Tab {
	/**
	 * Id of the tab
	 */
	id: number;

	ports: {
		/**
		 * Port of the devtools page (V4Fire tab in the browser devtools)
		 */
		devtools: chrome.runtime.Port | null;

		/**
		 * Port of the proxy which is injected into the inspected window
		 */
		proxy: chrome.runtime.Port | null;
	};

	/**
	 * Disconnect callback
	 */
	disconnect: (() => void) | null;
}
