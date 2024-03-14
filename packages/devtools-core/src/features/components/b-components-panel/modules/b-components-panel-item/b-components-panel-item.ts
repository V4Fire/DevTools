/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import iBlock, { component, prop } from 'components/super/i-block/i-block';

@component()
export default class bComponentsPanelItem extends iBlock {
	@prop({type: String, required: true})
	label!: string;

	@prop()
	data: unknown;

	@prop()
	select?: Dictionary;

	@prop({type: String})
	warning?: string;

	isFunction(data: unknown): boolean {
		return String(data) === 'Function' && Object.hasOwnProperty.call(data, 'declaration');
	}

	showFunction(data: {declaration: string}): void {
		// TODO: use custom window
		// eslint-disable-next-line no-alert
		globalThis.alert(data.declaration);
	}
}
