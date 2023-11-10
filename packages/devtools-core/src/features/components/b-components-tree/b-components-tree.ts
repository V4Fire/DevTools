/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { debounce } from 'core/functools';

import bTree, { component, system, field, watch, computed } from 'components/base/b-tree/b-tree';
import type { Item } from 'features/components/b-components-tree/interface';

export * from 'features/components/b-components-tree/interface';

@component()
export default class bComponentsTree extends bTree {
	override readonly Item!: Item;

	override readonly $refs!: bTree['$refs'] & {
		wrapper?: HTMLElement;
	};

	/**
	 * Search text for components
	 */
	@field()
	searchText: string = '';

	/**
	 * Prepared search statement from `searchText`
	 */
	@field()
	searchQuery: RegExp | string | null = null;

	/**
	 * Values of matching items
	 */
	@field()
	searchMatches: unknown[] = [];

	/**
	 * Indices of matching text in items' labels
	 */
	@field()
	searchMatchesIndices: Map<this['Item']['value'], [number, number]> = new Map();

	/**
	 * Current index of search matches
	 */
	@field()
	currentSearchIndex: number = -1;

	@system()
	override readonly item: string = 'b-components-tree-item';

	@system()
	override childrenTreeComponent: string = 'b-components-tree';

	/**
	 * Makes item active and scrolls to it if needed
	 *
	 * @param [dir]
	 */
	gotoNextItem(dir: -1 | 1 = 1): void {
		const {wrapper} = this.$refs;
		if (wrapper == null) {
			return;
		}

		let nextIndex = this.currentSearchIndex + dir;

		if (nextIndex >= this.searchMatches.length) {
			nextIndex = 0;

		} else if (nextIndex < 0) {
			nextIndex = this.searchMatches.length - 1;
		}

		const value = this.searchMatches[nextIndex];
		this.currentSearchIndex = nextIndex;

		if (value == null) {
			return;
		}

		if (value !== this.active) {
			this.setActive(value);
		}

		const el = this.findItemElement(value);

		if (el != null) {
			this.async.requestAnimationFrame(() => {
				const
					{offsetTop} = el,
					{clientHeight = 0} = el.querySelector(`.${this.block!.getFullElementName('item-wrapper')}`) ?? {},
					offsetBottom = offsetTop + clientHeight;

				if (offsetBottom > (wrapper.scrollTop + wrapper.clientHeight)) {
					wrapper.scrollTo(0, offsetBottom - wrapper.clientHeight);

				} else if (wrapper.scrollTop > offsetTop) {
					wrapper.scrollTo(0, offsetTop);
				}
			});
		}
	}

	protected override getItemProps(item: this['Item'], i: number): Dictionary {
		const
			op = this.itemProps,
			props: Dictionary = Object.reject(item, ['children', 'folded', 'componentName', 'parentValue']);

		props.treeState = this.top;

		if (op == null) {
			return props;
		}

		return Object.isFunction(op) ?
			op(item, i, {
				key: this.getItemKey(item, i),
				ctx: this,
				...props
			}) :

			Object.assign(props, op);
	}

	@watch('searchText')
	@debounce(25)
	protected setSearchQuery(): void {
		this.searchMatches = [];
		this.currentSearchIndex = -1;

		if (this.searchText === '') {
			this.searchQuery = null;
			this.searchMatchesIndices = new Map();
			return;
		}

		// Unwrapping proxy for performance benefits
		let string = Object.unwrapProxy(this.searchText);

		if (string.startsWith('/')) {
			string = string.slice(1);

			if (string.endsWith('/')) {
				string = string.slice(0, string.length - 1);
			}

			try {
				this.searchQuery = new RegExp(string, 'i');

			} catch (err) {
				// Bad regex. Make it not match anything.
				this.searchQuery = /.^/;
			}

		} else {
			this.searchQuery = string;
		}

		this.updateSearchMatches();
	}

	protected updateSearchMatches(): void {
		const {searchQuery} = this;

		if (searchQuery == null) {
			return;
		}

		const searchMatchesIndices = new Map();

		const traverse = (item: bComponentsTree['Item']) => {
			const indices = this.matchSearch(item, searchQuery);

			if (indices.every((x) => x !== -1)) {
				searchMatchesIndices.set(item.value, indices);
				this.searchMatches.push(item.value);

				// Go to the first match
				if (this.searchMatches.length === 1) {
					this.gotoNextItem();
				}
			}

			item.children?.forEach(traverse);
		};

		this.items.forEach(traverse);
		this.searchMatchesIndices = searchMatchesIndices;
	}

	/**
	 * Checks if item's label matches the search query.
	 * Returns match indices.
	 *
	 * @param item
	 * @param searchQuery
	 */
	protected matchSearch(item: this['Item'], searchQuery: RegExp | string): [number, number] {
		let
			startIndex = -1,
			stopIndex = -1;

		if (Object.isString(searchQuery)) {
			startIndex = item.label!.indexOf(searchQuery);
			stopIndex = startIndex + searchQuery.length;

		} else {
			const match = searchQuery.exec(item.label!);

			if (match != null) {
				startIndex = match.index;
				stopIndex = startIndex + match[0].length;
			}
		}

		return [startIndex, stopIndex];
	}
}
