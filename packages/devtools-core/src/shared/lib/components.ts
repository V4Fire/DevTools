/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

const normalizeComponentNameRegex = new RegExp(
	`^(${
		[
			'i-block',
			'i-data'
		].join('|')
	})`
);

/**
 * Normalizes components' names. For example `i-block` has many
 * intermediate components like: `i-block-state`, `i-block-handlers`, etc.
 * These names will be normalized to `i-block`.
 *
 * @param name
 *
 * @example
 * ```
 * normalizeComponentName('i-block-state') // 'i-block'
 * normalizeComponentName('i-data-data') // 'i-data'
 * normalizeComponentName('b-header') // 'b-header'
 * ```
 */
export function normalizeComponentName(name: string): string {
	const matches = normalizeComponentNameRegex.exec(name);
	if (matches != null) {
		return matches[1];
	}

	return name;
}
