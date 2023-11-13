/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { browserAPI } from 'core/browser-api';

interface Tab {
	/**
	 * Port of the devtools page (V4Fire tab in the browser devtools)
	 */
	devtoolsPort: chrome.runtime.Port | null;
}

/**
 * This class manages communication between the browser tabs and the devtools page
 * by forwarding messages from and to their ports
 */
export default class BrowserTabManager {
	/**
	 * All managed tabs by the extension service worker
	 */
	tabs: Map<number, Tab> = new Map();

	/**
	 * Register a new tab
	 * @param tabId
	 */
	register(tabId: number): Tab {
		if (!this.tabs.has(tabId)) {
			this.tabs.set(tabId, {devtoolsPort: null});
		}

		return this.tabs.get(tabId)!;
	}

	/**
	 * Unregister a tab
	 * @param tabId
	 */
	unregister(tabId: number): void {
		const tab = this.tabs.get(tabId);

		if (tab != null) {
			this.cleanup(tab);
		}
	}

	/**
	 * Cleanup tab connections
	 * @param tab
	 */
	cleanup(tab: Tab): void {
		// Perform cleanups: drop all connections, etc.
		tab.devtoolsPort?.disconnect();
	}

	/**
	 * Listen for incoming connections from devtools or the active tab
	 */
	listen(): void {
		browserAPI.runtime.onConnect.addListener((port) => {
			// Connection from devtools page
			if (/^\d+$/.test(port.name)) {
				// DevTools page port doesn't have tab id specified because its sender is the extension
				// so the tab id is encoded as the name of the port
				const
					tabId = Number(port.name),
					tab = this.register(tabId);

				// eslint-disable-next-line no-console
				console.log('New connection from devtools, tabId:', tabId);

				tab.devtoolsPort = port;
			}

			// TODO: Handle connection from content scripts
		});
	}
}
