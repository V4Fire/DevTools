/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import iBlock, { component, prop, field, computed } from 'components/super/i-block/i-block';

import type { Item, ComponentData } from 'features/components/b-components-panel/interface';

import { createItems } from 'features/components/b-components-panel/modules/helpers';

export * from 'features/components/b-components-panel/interface';

@component()
export default class bComponentsPanel extends iBlock {

	/**
	 * Component's data
	 */
	@prop(Object)
	componentData!: ComponentData;

	/**
	 * If `true` empty props and fields are shown
	 */
	@field()
	showEmpty: boolean = false;

	/**
	 * Stores items for `b-tree`
	 */
	@field<bComponentsPanel>((o) => o.sync.link(
		'componentData',
		(val) => createItems(<ComponentData>val)
	))

	protected itemsStore: Item[] = [];

	/**
	 * Returns filtered items for `b-tree`
	 */
	@computed({dependencies: ['itemsStore', 'showEmpty']})
	get items(): Item[] {
		const items = this.field.get<Item[]>('itemsStore') ?? [];
		return this.showEmpty ? items : removeEmpty(items);

		function removeEmpty(items: Item[]): Item[] {
			return items
				.map((item) => {
					const newItem = Object.fastClone(item);
					if (newItem.children != null) {
						newItem.children = removeEmpty(newItem.children);
					}

					return newItem;
				})
				.filter((item) => (item.children != null && item.children.length > 0) || item.data != null);
		}
	}

	/**
	 * Update show empty
	 *
	 * @param _
	 * @param checked
	 */
	protected showEmptyChange(_: unknown, checked?: boolean): void {
		this.showEmpty = Boolean(checked);
	}
}
