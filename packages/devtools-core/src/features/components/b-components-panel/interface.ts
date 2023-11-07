/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import type { Item as Super, ComponentMeta } from 'components/base/b-tree/b-tree';

export interface Item extends Super {
	data?: unknown;

	path?: string;
}

export type ComponentData = {
	/**
	 * Component's values for props, fields, etc.
	 */
	values: Dictionary;

	/**
	 * Inheritance hierarchy starts from closest parent
	 */
	hierarchy: string[];

} & Pick<
	ComponentMeta, 'componentName' | 'props' | 'fields' | 'computedFields' | 'systemFields'
>;

