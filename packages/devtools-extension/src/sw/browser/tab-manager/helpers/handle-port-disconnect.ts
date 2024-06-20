/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import type { Tab } from 'sw/browser/tab-manager/interface';

/**
 * Adds listener for port's disconnect event
 *
 * @param tab
 * @param portKey
 */
export default function handlePortDisconnect(
	tab: Tab,
	portKey: keyof Tab['ports']
): void {
	const port = tab.ports[portKey];

	// In case proxy port was disconnected from the other end, from content script
	// This can happen if content script was detached, when user does in-tab navigation
	// This listener should never be called when we call port.disconnect() from this service worker
	port?.onDisconnect.addListener(() => {
		tab.disconnect?.();

		tab.ports[portKey] = null;
	});
}
