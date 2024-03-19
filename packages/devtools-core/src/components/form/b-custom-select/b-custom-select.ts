/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import bSelect, { component, field } from '@v4fire/client/components/form/b-select/b-select';
import iActiveItems from 'components/traits/i-active-items/i-active-items';

export * from '@v4fire/client/components/form/b-select/b-select';

@component({functional: false})
export default class bCustomSelect extends bSelect {
	@field<bCustomSelect>({
		unique: true,
		init: (o) => {
			o.watch('valueProp', (val) => o.setActive(val, true));
			o.watch('modelValue', (val) => o.setActive(val, true));
			return iActiveItems.linkActiveStore(o, (val) => o.resolveValue(o.valueProp ?? o.modelValue ?? val));
		}
	})
	override activeStore!: iActiveItems['activeStore'];

	override async focus(): Promise<boolean> {
		await this.open();

		return super.focus();
	}
}
