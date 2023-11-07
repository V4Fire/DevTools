/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { browserAPI } from 'shared/lib';
import { updateExtensionTray } from 'sw/helpers';

export default class RuntimeMessageHandler {
	/**
	 * Listen for incoming runtime messages
	 */
	listen(): void {
		// TODO: refactor
		browserAPI.runtime.onMessage.addListener((message, sender) => {
			switch (message.source) {
				case 'v4fire-devtools-page':
					this.handleDevtoolsMessage(message.payload);
					break;

				case 'v4fire-devtools-detect':
					if (sender.tab?.id != null) {
						// NOTE: might need to handle different versions of the build: prod, dev, debug, etc.
						updateExtensionTray('enabled', sender.tab.id);
					}

					break;

				default:
					// Do nothing
			}
		});
	}

	/**
	 * Handle messages from devtools page
	 * @param payload
	 */
	protected handleDevtoolsMessage(payload: any): void {
		if (payload.type === 'inject-backend' && Number.isFinite(payload.tabId)) {
			browserAPI.scripting.executeScript({
				target: {tabId: payload.tabId},
				files: ['/backend.js'],
				world: 'MAIN'
			})
				// eslint-disable-next-line no-console
				.catch(console.error);
		}
	}
}
