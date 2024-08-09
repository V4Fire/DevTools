/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import type { ComponentMeta } from 'core/component';

export type ComponentData = {
	/**
	 * Component's id
	 */
	componentId: string;

	/**
	 * Component's values for props, fields, etc.
	 */
	values: Dictionary;

	/**
	 * Inheritance hierarchy starts from closest parent
	 */
	hierarchy: string[];

} & Pick<
	ComponentMeta, 'componentName' | 'props' | 'fields' | 'computedFields' | 'systemFields' | 'mods'
>;
