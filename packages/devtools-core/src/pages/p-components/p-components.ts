/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import iDynamicPage, { component, field } from 'components/super/i-dynamic-page/i-dynamic-page';

import type { Item } from 'components/base/b-tree/b-tree';

export * from 'components/super/i-dynamic-page/i-dynamic-page';

@component()
export default class pComponents extends iDynamicPage {

	/**
	 * Component tree
	 */
	@field()
	tree: Item[] = [];
}
