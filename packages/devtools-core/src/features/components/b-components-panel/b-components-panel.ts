/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import symbolGenerator from 'core/symbol';
import iBlock, { component, prop, field, computed } from 'components/super/i-block/i-block';

import type bTree from 'components/base/b-tree/b-tree';
import type { RenderFilter } from 'components/base/b-tree/b-tree';
import type { Item, ComponentData } from 'features/components/b-components-panel/interface';

import { createItems } from 'features/components/b-components-panel/modules/helpers';

export * from 'features/components/b-components-panel/interface';

const $$ = symbolGenerator();

@component()
export default class bComponentsPanel extends iBlock {
	override readonly $refs!: iBlock['$refs'] & {
		tree?: bTree;
	};

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
	 * Returns render filter for `bTree`, which delays rendering of children
	 * for folded items
	 */
	createTreeRenderFilter(): RenderFilter {
		const unfolded = new Set();
		const resolvers = new Map<unknown, (value: boolean) => void>();

		this.waitRef<bTree>('tree')
			.then((tree) => this.async.on(
				tree.unsafe.top.selfEmitter,
				'fold',
				(_ctx: unknown, _el: Element, item: Item, folded: boolean) => {
					if (folded) {
						unfolded.delete(item.value);

					} else {
						unfolded.add(item.value);

						resolvers.get(item.value)?.(true);
						resolvers.delete(item.value);
					}
				},
				{label: $$.foldChange}
			))
			.catch(stderr);

		return (ctx, el, i) => {
			if (ctx.level === 0 && i < ctx.renderChunks) {
				return true;
			}

			if (!ctx.folded || unfolded.has(el.parentValue)) {
				return true;
			}

			return new Promise<boolean>((resolve) => {
				resolvers.set(el.parentValue, resolve);
			});
		};
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
