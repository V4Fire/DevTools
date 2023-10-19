/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
export default class CouldNotFindV4FireOnThePageError extends Error {
	constructor() {
		super("Could not find V4Fire, or it hasn't been loaded yet");

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (typeof Error.captureStackTrace === 'function') {
			Error.captureStackTrace(this, CouldNotFindV4FireOnThePageError);
		}

		this.name = 'CouldNotFindReactOnThePageError';
	}
}
