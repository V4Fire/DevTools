/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import Friend from 'components/friends/friend';
import type iBlock from 'components/super/i-block/i-block';

import type iSearch from 'components/traits/i-search/i-search';
import type { SearchDirection, SearchMatch, Transformer } from 'components/traits/i-search/search/interface';

export * from 'components/traits/i-search/search/interface';

export default class Search<Item = unknown> extends Friend {
	override readonly C!: iSearch;

	/**
	 * Returns string which can be searched to match the item
	 */
	readonly getSearchable: Transformer<Item>;

	/**
	 * Returns item's id
	 */
	readonly getId?: Transformer<Item>;

	/**
	 * Getter for search query
	 */
	get searchQuery(): RegExp | string | null {
		return this.searchQueryStore;
	}

	/**
	 * Setter for search query
	 * @param value
	 */
	set searchQuery(value: RegExp | string | null) {
		this.searchQueryStore = value;

		if (value == null) {
			this.searchMatches = [];
		}
	}

	/**
	 * Returns current match
	 */
	get currentMatch(): Item | null {
		return this.searchMatches[this.ctx.searchEntryIndex] ?? null;
	}

	/**
	 * Getter for search matches
	 */
	protected get searchMatches(): Item[] {
		return this.searchMatchesStore;
	}

	/**
	 * Setter for search matches
	 * @param value
	 */
	protected set searchMatches(value: Item[]) {
		this.searchMatchesStore = value;
		this.ctx.searchEntryIndex = -1;
		this.ctx.searchMatchCount = value.length;
	}

	/**
	 * Matching items
	 */
	protected searchMatchesStore: Item[] = [];

	/**
	 * Prepared search statement
	 */
	protected searchQueryStore: RegExp | string | null = null;

	constructor(
		component: iBlock,
		getSearchable: Transformer<Item> = (item) => String(item),
		getId?: Transformer<Item>
	) {
		super(component);
		this.getSearchable = getSearchable;
		this.getId = getId;
	}

	/**
	 * Returns next match item and changes `searchEntryIndex` of the `ctx`
	 *
	 * @param dir
	 */
	gotoNextMatch(dir: SearchDirection): Item {
		let nextIndex = this.ctx.searchEntryIndex + dir;

		if (nextIndex >= this.searchMatches.length) {
			nextIndex = 0;

		} else if (nextIndex < 0) {
			nextIndex = this.searchMatches.length - 1;
		}

		const item = this.searchMatches[nextIndex];

		if (this.getId != null) {
			const prev = this.searchMatches[this.ctx.searchEntryIndex];

			if (prev != null) {
				this.ctx.localEmitter.strictEmit(`highlight-current.${this.getId(prev)}`, false);
			}

			this.ctx.localEmitter.strictEmit(`highlight-current.${this.getId(item)}`, true);
		}

		this.ctx.searchEntryIndex = nextIndex;

		return item;
	}

	/**
	 * Returns start and stop index of the match for given item
	 * @param item
	 */
	match(item: Item): [number, number] {
		return this.matchText(this.getSearchable(item));
	}

	/**
	 * Returns start and stop index of the match for given text
	 * @param text
	 */
	matchText(text: string): [number, number] {
		let
			startIndex = -1,
			stopIndex = -1;

		if (Object.isString(this.searchQuery)) {
			startIndex = text.indexOf(this.searchQuery);
			stopIndex = startIndex + this.searchQuery.length;

		} else if (Object.isRegExp(this.searchQuery)) {
			const match = this.searchQuery.exec(text);

			if (match != null) {
				startIndex = match.index;
				stopIndex = startIndex + match[0].length;
			}
		}

		return [startIndex, stopIndex];
	}

	/**
	 * Resets the search matches and search query
	 */
	reset(): void {
		this.searchQuery = null;

		this.ctx.localEmitter.strictEmit('highlight-reset');
	}

	/**
	 * Updates the search query and notifies `v-highlight` directives.
	 * Returns `true` if search query was updated.
	 *
	 * @param searchText
	 * @param [shouldNotify]
	 */
	update(searchText: string, shouldNotify: boolean = true): boolean {
		// Unwrap just in case if value is a proxy
		let str = Object.unwrapProxy(searchText);

		if (str.startsWith('/')) {
			str = str.slice(1);

			if (str.endsWith('/')) {
				str = str.slice(0, str.length - 1);
			}

			try {
				this.searchQuery = new RegExp(str, 'i');

			} catch (err) {
				this.searchQuery = null;
			}

		} else {
			this.searchQuery = str !== '' ? str : null;
		}

		if (this.searchQuery == null) {
			return false;
		}

		if (shouldNotify) {
			this.ctx.localEmitter.strictEmit('highlight');
		}

		return true;
	}

	/**
	 * Set new search matches
	 * @param matches
	 */
	setMatches(matches: Iterable<SearchMatch<Item>>): void {
		const searchMatches: Item[] = [];

		for (const {item, indices} of matches) {
			searchMatches.push(item);

			const id = this.getId?.(item);
			if (id != null) {
				this.ctx.localEmitter.strictEmit(`highlight.${id}`, indices);
			}
		}

		// Reset highlight for old search matches
		if (this.getId != null) {
			for (let i = 0; i < this.searchMatches.length; i++) {
				const item = this.searchMatches[i];

				if (!searchMatches.includes(item)) {
					const id = this.getId(item);
					this.ctx.localEmitter.strictEmit(`highlight.${id}`, null);
				}
			}
		}

		this.searchMatches = searchMatches;
	}

	/**
	 * Changes scroll of the container so that the element becomes visible
	 * if element is already visible - does nothing
	 *
	 * @param container
	 * @param element - element which must become visible after the scroll
	 * @param [elementHeight] - custom height for the element, useful with deeply nested elements
	 */
	scrollContainerToElement(container: HTMLElement, element: HTMLElement, elementHeight?: number): void {
		this.ctx.async.requestAnimationFrame(() => {
			const
				{offsetTop} = element,
				offsetBottom = offsetTop + (elementHeight ?? element.clientHeight);

			if (offsetBottom > (container.scrollTop + container.clientHeight)) {
				container.scrollTo(0, offsetBottom - container.clientHeight);

			} else if (container.scrollTop > offsetTop) {
				container.scrollTo(0, offsetTop);
			}
		});
	}
}
