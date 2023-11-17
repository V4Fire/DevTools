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
		/**
		 * Highlight event for specific node
		 *
		 * @param indices
		 * @example
		 * ```
		 * const id = 1;
		 * const startIndex = 'text to highlight'.indexOf('to high');
		 * const stopIndex = startIndex + 'to high'.length;
		 * emitter.emit(`highlight.${id}`, [startIndex, stopIndex]);
		 * ```
		 */
		[`highlight.${string}`, [number, number] | null],
		/**
		 * Mark highlighted node as selected
		 *
		 * @param selected
		 */
		[`highlight-current.${string}`, boolean],
		/**
		 * Resets highlight on all elements for given ctx
		 */
		['highlight-reset'],
		/**
		 * General highlight event, which will be emitted to all nodes with v-highlight
		 */
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
