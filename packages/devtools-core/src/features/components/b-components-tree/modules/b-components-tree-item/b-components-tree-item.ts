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
	@prop({type: String, required: true})
	label!: string;

	@prop({type: Number, required: true})
	renderCounterProp!: number;

	@prop({type: Boolean, required: true})
	isFunctionalProp!: number;

	@prop({type: Boolean, required: true})
	showWarning!: boolean;
}
