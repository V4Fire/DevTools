/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { debounce } from 'core/functools';
import { derive } from 'core/functools/trait';
import { ComponentHandle } from 'core/inspect';

import iBlock, { component, prop, field, system, watch, hook } from 'components/super/i-block/i-block';

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

	@system<bComponentsTree>((o) => o.sync.link<bComponentsTree['items'], Map<string, ComponentHandle>>('items', (value) => {
		const stack = [...value];
		const handles = new Map();

		while (stack.length > 0) {
			// NOTE: order is not important
			const item = stack.pop()!;
			const {value: componentId, componentName} = item;
			handles.set(componentId, new ComponentHandle({componentId, componentName}));

			if (item.children != null) {
				stack.push(...item.children);
			}
		}

		return handles;
	}))

	componentHandles!: Map<string, ComponentHandle>;

	/**
	 * Id of highlighted component
	 */
	@system()
	highlightedComponentId: string | null = null;

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

		this.scrollToItem(value);
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
	 * Find item by it's value and scroll to it
	 * @param value
	 */
	protected scrollToItem(value: string): void {
		const {tree, wrapper} = this.$refs;

		// It's ugly but we need to scroll to this element
		const el = tree!.unsafe.findItemElement(value);

		if (el != null) {
			const {clientHeight = 0} = el.querySelector(`.${tree!.unsafe.block!.getFullElementName('item-wrapper')}`) ?? {};

			this.search.scrollContainerToElement(wrapper!, el, clientHeight);
		}
	}

	/**
	 * Listens for change in component tree
	 *
	 * @param _
	 * @param componentId
	 */
	@watch('?$refs.tree:change')
	protected onTreeChange(_: unknown, componentId: string): void {
		this.emit('change', this.componentHandles.get(componentId));
	}

	/**
	 * Watch for `select-component` event from root
	 *
	 * @param _
	 * @param payload
	 */
	// FIXME: watch r.bridge:select-component
	@watch('rootEmitter:bridge.select-component')
	protected onSelectComponent(_: unknown, payload: any): void {
		const {componentId} = payload;
		if (this.$refs.tree?.setActive(componentId)) {
			this.scrollToItem(componentId);
		}
	}

	@hook('mounted')
	protected init(): void {
		this.async.on(this.selfEmitter, 'change', (_: unknown, component: ComponentHandle) => {
			component.highlight(this.highlightedComponentId !== component.componentId);
		});
	}

	/**
	 * Handle item mouseenter event
	 *
	 * @param item
	 * @param _event
	 */
	protected onItemMouseEnter(item: Item, _event: MouseEvent): void {
		this.highlightedComponentId = item.value;
		this.componentHandles.get(item.value)?.highlight(false);
	}

	/**
	 * Handle item mouseleave event
	 *
	 * @param _item
	 * @param _event
	 */
	protected onItemMouseLeave(_item: Item, _event: MouseEvent): void {
		// TODO: use engine to remove highlight from the component node
	}
}

export default bComponentsTree;
