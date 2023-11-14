/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import type { DirectiveBinding } from 'core/component/engines';
import type TypedEventEmitter from 'typed-emitter';

export interface DirectiveParams extends DirectiveBinding<HighlightOptions> {}

export interface HighlightOptions {
	/**
	 * Text which should be highlighted
	 */
	text: string;

	/**
	 * Context of the highlight: usually a component name
	 */
	ctx: string;

	/**
	 * Identifier of the highlight node
	 */
	id?: string | number;

	/**
	 * Event emitter to listen for highlight events
	 */
	emitter?: HighlightEmitter;
}

export type HighlightEvents = {
	/**
	 * Highlight event for specific node
	 *
	 * @param indices
	 * @example
	 * ```
	 * const id = 1;
	 * const startIndex = 'text to highlight'.indexOf('to high');
	 * const stopIndex = startIndex + 'to high'.length;
	 * emitter.emit(`highlight:global-search:${id}`, [startIndex, stopIndex]);
	 * ```
	 */
	[K in `highlight:${string}:${string}`]: (indices: [number, number] | null) => void;
} & {
	/**
	 * General highlight event, which will be emitted to all nodes with v-highlight
	 *
	 * @param matchQuery
	 * @example
	 * ```
	 * // Highlight all elements matching `/some text/i`
	 * emitter.emit('highlight:global-search', /some text/i);
	 * ```
	 */
	[K in `highlight:${string}`]: (matchQuery: RegExp | string) => void;
} & {
	/**
	 * Resets highlight on all elements for given ctx
	 *
	 * @param ctx
	 */
	[K in `highlight:${string}:reset`]: () => void;
};

export type HighlightEmitter = TypedEventEmitter<HighlightEvents>;
