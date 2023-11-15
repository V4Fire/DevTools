/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

export type SearchDirection = -1 | 1;

export type Transformer<T = unknown> = (item: T) => string;

export interface SearchMatch<T = unknown> {
	item: T;
	indices: [number, number];
}
