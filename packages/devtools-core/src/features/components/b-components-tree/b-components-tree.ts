/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { debounce } from 'core/functools';
import { derive } from 'core/functools/trait';

import iBlock, { component, prop, field, system, watch } from 'components/super/i-block/i-block';

import Search, { SearchDirection, SearchMatch } from 'components/traits/i-search/search';
import iSearch from 'components/traits/i-search/i-search';

import type bTree from 'components/base/b-tree/b-tree';
import type { Item } from 'features/components/b-components-tree/interface';

export * from 'features/components/b-components-tree/interface';

interface bComponentsTree extends Trait<typeof iSearch> {}

@component()
@derive(iSearch)
class bComponentsTree extends iBlock implements iSearch<Item> {
	override readonly $refs!: iBlock['$refs'] & {
		wrapper?: HTMLElement;
		tree?: bTree;
	};

	/**
	 * Items for `b-tree`
	 */
	@prop({type: Array, required: true})
	items!: Item[];

	/**
	 * Search text for components
	 */
	@field()
	searchText: string = '';

	/** {@link iSearch.searchEntryIndex} */
	@field()
	searchEntryIndex: number = -1;

	/** {@link iSearch.searchMatchCount} */
	@field()
	searchMatchCount: number = 0;

	/**
	 * Search engine
	 */
	@system<iSearch>((ctx) => new Search<Item>(
		ctx,
		(item) => item.label,
		(item) => item.value
	))

	search!: Search<Item>;

	/**
	 * Makes item active and scrolls to it if needed
	 *
	 * @param [dir]
	 */
	gotoNextItem(dir: SearchDirection = 1): void {
		const {wrapper, tree} = this.$refs;
		if (wrapper == null || tree == null) {
			return;
		}

		const item = this.search.gotoNextMatch(dir);
		const {value} = item;

		if (value !== tree.active) {
			tree.setActive(value);
		}

		// It's ugly but we need to scroll to this element
		const el = tree.unsafe.findItemElement(value);

		if (el != null) {
			const {clientHeight = 0} = el.querySelector(`.${tree.unsafe.block!.getFullElementName('item-wrapper')}`) ?? {};

			this.search.scrollContainerToElement(wrapper, el, clientHeight);
		}
	}

	/**
	 * This method is passed as `itemProps` prop to the `b-tree`
	 * @param item
	 */
	protected itemProps(item: Item): Dictionary {
		const props: Dictionary = Object.reject(
			item,
			['children', 'folded', 'componentName', 'parentValue']
		);

		props['@mouseenter'] = this.onItemMouseEnter.bind(this, item);
		props['@mouseleave'] = this.onItemMouseLeave.bind(this, item);

		return props;
	}

	@watch('searchText')
	@debounce(25)
	protected setSearchQuery(): void {
		if (this.search.update(this.searchText, false)) {
			this.updateSearchMatches();

		} else {
			this.search.reset();
		}
	}

	/**
	 * Updates search matches and makes active first matching item
	 */
	protected updateSearchMatches(): void {
		this.search.setMatches(this.getSearchMatches(this.items));

		// Go to first search match
		if (this.searchMatchCount > 0) {
			this.gotoNextItem();
		}
	}

	/**
	 * Returns search matches for given items
	 * @param items
	 */
	protected *getSearchMatches(items: Item[]): Generator<SearchMatch<Item>> {
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			const indices = this.search.match(item);
			if (!indices.some((x) => x === -1)) {
				yield {item, indices};
			}

			if (item.children != null) {
				yield* this.getSearchMatches(item.children);
			}
		}
	}

	/**
	 *
	 * @param _
	 * @param componentId
	 */
	@watch('?$refs.tree:change')
	protected onTreeChange(_: unknown, componentId: string): void {
		this.emit('change', componentId);
	}

	/**
	 * Handle item mouseenter event
	 *
	 * @param item
	 * @param event
	 */
	protected onItemMouseEnter(item: Item, event: MouseEvent): void {
		// TODO: use engine to highlight the component node
	}

	/**
	 * Handle item mouseleave event
	 *
	 * @param item
	 * @param event
	 */
	protected onItemMouseLeave(item: Item, event: MouseEvent): void {
		// TODO: use engine to remove highlight from the component node
	}
}

export default bComponentsTree;
