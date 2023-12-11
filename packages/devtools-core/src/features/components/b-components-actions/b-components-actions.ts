/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import iBlock, { component } from 'components/super/i-block/i-block';
import type bWindow from 'components/base/b-window/b-window';

@component()
export default class bComponentsActions extends iBlock {
	override readonly $refs!: iBlock['$refs'] & {
		modal?: bWindow;
	};

	/**
	 * Enables component search via DOM
	 */
	enableLocateComponent(): void {
		this.$refs.modal?.open().catch(stderr);
	}

	/**
	 * Disables component search via DOM
	 */
	disableLocateComponent(): void {
		this.$refs.modal?.close().catch(stderr);
	}
}
