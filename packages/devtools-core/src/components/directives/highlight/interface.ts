/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import type { DirectiveBinding } from 'core/component/engines';

export interface DirectiveParams extends DirectiveBinding<HighlightOptions> {}

export interface HighlightOptions {
	/**
	 * Text which should be highlighted
	 */
	text: string;

	/**
	 * Identifier of the highlight node
	 */
	id?: string;
}
