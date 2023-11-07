/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import bTree, { component, prop, field, computed, system } from 'components/base/b-tree/b-tree';
import type { Item, ComponentData } from 'features/components/b-components-panel/interface';

import { normalizeItems } from 'components/base/b-tree/modules/helpers';
import { createItems } from 'features/components/b-components-panel/modules/helpers';

export * from 'features/components/b-components-panel/interface';

@component()
export default class bComponentsPanel extends bTree {
	override readonly Item!: Item;

	/**
	 * Component's data
	 */
	@prop(Object)
	componentData!: ComponentData;

	@prop(Boolean)
	override readonly lazyRender: boolean = true;

	@system()
	override readonly item: string = 'b-components-panel-item';

	/**
	 * If `true` empty props and fields are shown
	 */
	@field()
	showEmpty: boolean = false;

	@computed({dependencies: ['itemsStore', 'showEmpty']})
	override get items(): this['Items'] {
		const items = this.field.get<this['Items']>('itemsStore') ?? [];
		return this.showEmpty ? items : removeEmpty(items);

		function removeEmpty(items: bComponentsPanel['Items']): bComponentsPanel['Items'] {
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

	@field<bComponentsPanel>((o) => o.sync.link<ComponentData>(
		'componentData', (val) => normalizeItems.call(o, createItems(val))
	))

	protected override itemsStore: this['Items'] = [];

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
