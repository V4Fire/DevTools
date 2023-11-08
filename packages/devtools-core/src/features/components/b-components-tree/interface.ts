/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import type { Item as Super } from 'components/base/b-tree/b-tree';

export interface Item extends Super {
	componentName: string;

	renderCounterProp: number;

	isFunctionalProp: boolean;
}

