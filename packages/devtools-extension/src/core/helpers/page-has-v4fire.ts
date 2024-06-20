/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

/**
 * Returns `true` if v4fire is detected on the page
 */
export default function pageHasV4Fire(): boolean {
	// TODO: improve detection
	return typeof (<{TPLS: object} & typeof globalThis>globalThis).TPLS === 'object' &&
		document.querySelector('.i-block-helper') != null;
}
