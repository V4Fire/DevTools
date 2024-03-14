/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import bSelect, { component, field } from '@v4fire/client/components/form/b-select/b-select';
import iActiveItems from 'components/traits/i-active-items/i-active-items';
import Block, { elements } from 'components/friends/block';

export * from '@v4fire/client/components/form/b-select/b-select';

// TODO: remove after fixing in `@v4fire/client` https://github.com/V4Fire/Client/pull/1177
Block.addToPrototype({elements});

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
