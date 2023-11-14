/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { debounce } from 'core/functools';

import iBlock, { component, prop, field, watch } from 'components/super/i-block/i-block';

import type bTree from 'components/base/b-tree/b-tree';
import type { Item } from 'features/components/b-components-tree/interface';
import { matchText } from 'components/directives/highlight/helpers';

export * from 'features/components/b-components-tree/interface';

@component()
export default class bComponentsTree extends iBlock {
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

	/**
	 * Prepared search statement from `searchText`
	 */
	@field()
	searchQuery: RegExp | string | null = null;

	/**
	 * Values of matching items
	 */
	@field()
	searchMatches: string[] = [];

	/**
	 * Current index of search matches
	 */
	@field()
	currentSearchIndex: number = -1;

	/**
	 * Makes item active and scrolls to it if needed
	 *
	 * @param [dir]
	 */
	gotoNextItem(dir: -1 | 1 = 1): void {
		const {wrapper, tree} = this.$refs;
		if (wrapper == null || tree == null) {
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

		if (value !== tree.active) {
			tree.setActive(value);
		}

		// It's ugly but we need to scroll to this element
		const el = tree.unsafe.findItemElement(value);

		if (el != null) {
			this.async.requestAnimationFrame(() => {
				const
					{offsetTop} = el,
					{clientHeight = 0} = el.querySelector(`.${tree.unsafe.block!.getFullElementName('item-wrapper')}`) ?? {},
					offsetBottom = offsetTop + clientHeight;

				if (offsetBottom > (wrapper.scrollTop + wrapper.clientHeight)) {
					wrapper.scrollTo(0, offsetBottom - wrapper.clientHeight);

				} else if (wrapper.scrollTop > offsetTop) {
					wrapper.scrollTo(0, offsetTop);
				}
			});
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

		props.highlightCtx = this.componentName;

		return props;
	}

	@watch('searchText')
	@debounce(25)
	protected setSearchQuery(): void {
		if (this.searchText === '') {
			this.searchQuery = null;
			this.updateSearchMatches();
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
			this.searchMatches = [];
			this.currentSearchIndex = -1;
			this.globalEmitter.emit(`highlight:${this.componentName}:reset`);
			return;
		}

		const searchMatches: string[] = [];

		const traverse = (item: Item) => {
			const indices = matchText(item.label, searchQuery);

			if (indices.every((x) => x !== -1)) {
				this.globalEmitter.emit(`highlight:${this.componentName}:${item.value}`, indices);
				searchMatches.push(item.value);
			}

			item.children?.forEach(traverse);
		};

		this.items.forEach(traverse);

		// Reset highlight for old search matches
		const oldSearchMatches = this.searchMatches.filter((value) => !searchMatches.includes(value));
		oldSearchMatches.forEach((value) => this.globalEmitter.emit(`highlight:${this.componentName}:${value}`, null));

		this.currentSearchIndex = -1;
		this.searchMatches = searchMatches;

		// Go to first search match
		if (this.searchMatches.length > 0) {
			this.gotoNextItem();
		}
	}

	@watch('?$refs.tree:change')
	protected onTreeChange(_: unknown, componentId: string): void {
		this.emit('change', componentId);
	}
}
