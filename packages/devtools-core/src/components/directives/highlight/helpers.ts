/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

/**
 * Returns start and stop index of the match for given text and query
 *
 * @param text
 * @param matchQuery
 */
export function matchText(text: string, matchQuery: RegExp | string): [number, number] {
	let
		startIndex = -1,
		stopIndex = -1;

	if (Object.isString(matchQuery)) {
		startIndex = text.indexOf(matchQuery);
		stopIndex = startIndex + matchQuery.length;

	} else {
		const match = matchQuery.exec(text);

		if (match != null) {
			startIndex = match.index;
			stopIndex = startIndex + match[0].length;
		}
	}

	return [startIndex, stopIndex];
}
