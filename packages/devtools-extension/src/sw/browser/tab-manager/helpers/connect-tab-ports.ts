/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import type { Tab } from 'sw/browser/tab-manager/interface';

/**
 * Enables message proxy between devtools and proxy port
 *
 * @param tab
 * @throws {Error} - in case ports are already connected
 */
export default function connectTabPorts(tab: Tab): void {
	const devtoolsPort = tab.ports.devtools;
	const proxyPort = tab.ports.proxy;

	if (devtoolsPort == null || proxyPort == null) {
		return;
	}

	if (tab.disconnect != null) {
		throw new Error(
			`Attempted to connect already connected ports for tab with id ${tab.id}`
		);
	}

	const
		devtoolsPortMessageListener = createPortMessageListener(proxyPort),
		proxyPortMessageListener = createPortMessageListener(devtoolsPort);

	const disconnectListener = () => {
		devtoolsPort.onMessage.removeListener(devtoolsPortMessageListener);
		proxyPort.onMessage.removeListener(proxyPortMessageListener);

		// We handle disconnect() calls manually, based on each specific case
		// No need to disconnect other port here
		tab.disconnect = null;
	};

	function createPortMessageListener(portOut: chrome.runtime.Port) {
		return (message: unknown) => {
			try {
				portOut.postMessage(message);
			} catch (e) {
				stderr(new Error(`Broken pipe ${tab.id}`, {cause: e}));

				disconnectListener();
			}
		};
	}

	tab.disconnect = disconnectListener;

	devtoolsPort.onMessage.addListener(devtoolsPortMessageListener);
	proxyPort.onMessage.addListener(proxyPortMessageListener);

	devtoolsPort.onDisconnect.addListener(disconnectListener);
	proxyPort.onDisconnect.addListener(disconnectListener);
}
