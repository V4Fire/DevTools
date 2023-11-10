/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import type { Item as Super } from 'components/base/b-tree/b-tree';
import type bComponentsTree from 'features/components/b-components-tree/b-components-tree';

export interface Item extends Super {
	componentName: string;

	renderCounterProp: number;

	isFunctionalProp: boolean;

	/**
	 * Nested items
	 */
	children?: Item[];
}

export type ComponentsTreeState = Pick<
	bComponentsTree,
	'active' | 'searchMatchesIndices' | 'searchMatches' | 'currentSearchIndex'
>;
