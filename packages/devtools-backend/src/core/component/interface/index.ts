/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

/**
 * Parameters to search for a component
 */
export interface ComponentQuery {
	/**
	 * The unique component identifier.
	 * The value is formed based on the passed prop or dynamically.
	 */
	readonly componentId: string;

	/**
	 * The component name in dash-style without special postfixes like `-functional`
	 */
	readonly componentName: string;
}
