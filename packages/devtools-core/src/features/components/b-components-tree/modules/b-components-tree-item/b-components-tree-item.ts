/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import iBlock, { component, prop } from 'components/super/i-block/i-block';

@component()
export default class bComponentsTreeItem extends iBlock {
	/**
	 * Item's label
	 */
	@prop({type: String, required: true})
	label!: string;

	/**
	 * Item's value
	 */
	@prop({type: String, required: true})
	value!: string;

	/**
	 * Render count of a given component
	 */
	@prop({type: Number, required: true})
	renderCounterProp!: number;

	/**
	 * Is `true` for a functional component
	 */
	@prop({type: Boolean, required: true})
	isFunctionalProp!: boolean;

	/**
	 * Always shows component's details highlighted as warning
	 */
	@prop({type: Boolean, required: true})
	showWarning!: boolean;
}
