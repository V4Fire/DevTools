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
	 * Identifier of the highlight node
	 */
	id?: string;
}

// TODO: remove these events when `InferEvents` will be fixed in the `iBlock`
export type HighlightEvents = {
	/**
	 * Mark highlighted node as selected
	 *
	 * @param selected
	 */
	[K in `highlight-current.${string}`]: (selected: boolean) => void;
} & {
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
	[K in `highlight.${string}`]: (indices: [number, number] | null) => void;
} & {
	/**
	 * General highlight event, which will be emitted to all nodes with v-highlight
	 *
	 * @param matchQuery
	 * @example
	 * ```
	 * // Highlight all elements matching `/some text/i`
	 * emitter.emit('highlight', /some text/i);
	 * ```
	 */
	highlight(matchQuery: RegExp | string): void;

	/**
	 * Resets highlight on all elements for given ctx
	 *
	 * @param ctx
	 */
	['highlight-reset'](): void;
};

export type HighlightEmitter = TypedEventEmitter<HighlightEvents>;
