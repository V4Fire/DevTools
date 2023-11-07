/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { browserAPI, isManifestV2 } from 'shared/lib';

type Mode = 'disabled' | 'enabled';

/**
 * Sets the extension icon and popup
 *
 * @param mode
 * @param tabId
 */
export default function updateExtensionTray(mode: Mode, tabId: number): void {
	const action = isManifestV2 ? browserAPI.browserAction : browserAPI.action;

	void action.setIcon({
		tabId,
		path: {
			16: browserAPI.runtime.getURL(`assets/icons/${mode}/16.png`),
			32: browserAPI.runtime.getURL(`assets/icons/${mode}/32.png`),
			48: browserAPI.runtime.getURL(`assets/icons/${mode}/48.png`),
			128: browserAPI.runtime.getURL(`assets/icons/${mode}/128.png`)
		}
	});

	void action.setPopup({
		tabId,
		popup: browserAPI.runtime.getURL(`p-popup-${mode}.html`)
	});
}
