/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import type { ComponentHandle } from 'core/inspect';

import iBlock, { component, prop, field, computed } from 'components/super/i-block/i-block';

import type bTree from 'components/base/b-tree/b-tree';
import type { Item, ComponentData } from 'features/components/b-components-panel/interface';

import { createItems } from 'features/components/b-components-panel/modules/helpers';
import type bDropdown from 'components/form/b-dropdown/b-dropdown';

export * from 'features/components/b-components-panel/interface';

@component()
export default class bComponentsPanel extends iBlock {
	override readonly $refs!: iBlock['$refs'] & {
		tree?: bTree;
	};

	/**
	 * Component's handle
	 */
	@prop(Object)
	componentHandle!: ComponentHandle;

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
	 * Returns formatted props for panel item
	 * @param item
	 */
	protected getPanelItemProps(item: Item): Dictionary {
		if (item.allowedValues != null) {
			return {
				...item,

				select: {
					items: item.allowedValues.map((value) => ({label: value, value})),

					'@actionChange': (_ctx: bDropdown, value: unknown): void => {
						if (item.label == null) {
							return;
						}

						this.onItemChangeMod(item.label, value);
					}
				}
			};
		}

		return item;
	}

	/**
	 * Change selected component mod
	 *
	 * @param key
	 * @param value
	 */
	protected onItemChangeMod(key: string, value: unknown): void {
		this.componentHandle.setMod(key, value).catch(stderr);
	}

	/**
	 * Update show empty
	 */
	protected onShowEmptyChange(): void {
		this.showEmpty = !this.showEmpty;
	}

	/**
	 * Inspect component's node
	 */
	protected onInspect(): void {
		// FIXME: think for the better encapsulation
		this.componentHandle.evaluate((ctx) => {
			// eslint-disable-next-line @typescript-eslint/method-signature-style
			const {inspect} = <{inspect?: (el: Element) => void} & Global>globalThis;

			if (typeof inspect !== 'function') {
				// eslint-disable-next-line no-alert
				alert('Browser doesn\'t provide inspect util');
				return;
			}

			const node = globalThis.__V4FIRE_DEVTOOLS_BACKEND__.findComponentNode(ctx);

			if (node != null) {
				inspect(node);

			} else {
				// eslint-disable-next-line no-alert
				alert('Component\'s node not found');
			}
		}).catch(stderr);
	}
}
