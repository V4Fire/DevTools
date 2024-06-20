/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import iBlock, { component, prop } from 'components/super/i-block/i-block';
import type { PanelItemSelect } from 'features/components/b-components-panel/modules/b-components-panel-item/interface';

export * from 'features/components/b-components-panel/modules/b-components-panel-item/interface';

@component()
export default class bComponentsPanelItem extends iBlock {
	@prop({type: String, required: true})
	label!: string;

	@prop()
	data: unknown;

	@prop({type: Array})
	select?: PanelItemSelect;

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
