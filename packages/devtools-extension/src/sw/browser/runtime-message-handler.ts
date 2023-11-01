/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { browserAPI } from 'shared/lib';

export default class RuntimeMessageHandler {
	/**
	 * Listen for incoming runtime messages
	 */
	listen(): void {
		// TODO: refactor
		browserAPI.runtime.onMessage.addListener((message) => {
			switch (message.source) {
				case 'devtools-page':
					this.handleDevtoolsMessage(message.payload);
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
