/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { browserAPI } from 'core/browser-api';

import type { Tab } from 'sw/browser/tab-manager/interface';

import {

	handlePortDisconnect,
	connectTabPorts

} from 'sw/browser/tab-manager/helpers';

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
			this.tabs.set(tabId, {
				id: tabId,
				ports: {
					devtools: null,
					proxy: null
				},
				disconnect: null
			});
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
		tab.ports.devtools?.disconnect();
		tab.ports.proxy?.disconnect();
	}

	/**
	 * Listen for incoming connections from devtools or the active tab
	 */
	listen(): void {
		browserAPI.runtime.onConnect.addListener((port) => {
			let tab: Tab | null = null;

			// Connection from devtools page
			if (/^\d+$/.test(port.name)) {
				// DevTools page port doesn't have tab id specified
				// because it's sender is the extension so the tab id is encoded as the name of the port
				const tabId = Number(port.name);

				tab = this.register(tabId);

				// eslint-disable-next-line no-console
				console.log('New connection from devtools, tabId:', tabId);

				tab.ports.devtools = port;
				handlePortDisconnect(tab, 'devtools');

			// Connection from inspected window.
			// Tab might not be present for restricted pages in Firefox.
			} else if (port.name === 'proxy' && port.sender?.tab?.id != null) {
				const tabId = port.sender.tab.id;

				tab = this.register(tabId);

				// eslint-disable-next-line no-console
				console.log('New connection from inspected window, tabId:', tabId);

				if (tab.ports.proxy != null) {

					// eslint-disable-next-line no-console
					console.log('Reset previous proxy connection');
					tab.disconnect?.();
					tab.ports.proxy.disconnect();
				}

				tab.ports.proxy = port;
				handlePortDisconnect(tab, 'proxy');
			}

			if (tab != null) {
				connectTabPorts(tab);
			}
		});
	}
}
