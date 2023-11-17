/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import type iBlock from 'components/super/i-block/i-block';
import type { InferEvents } from 'components/super/i-block/i-block';
import type Search from 'components/traits/i-search/search';

interface iSearch extends iBlock {}

abstract class iSearch<Item = unknown> {
	readonly LocalEmitter!: InferEvents<[
		[`highlight.${string}`, [number, number] | null],
		[`highlight-current.${string}`, boolean],
		['highlight-reset'],
		['highlight']
	], iBlock['LocalEmitter']>;

	/**
	 * Search engine
	 */
	abstract search: Search<Item>;

	/**
	 * Index of current search item
	 */
	abstract searchEntryIndex: number;

	/**
	 * Number of matching items
	 */
	abstract searchMatchCount: number;
}

export default iSearch;
