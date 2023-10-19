/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { browserAPI } from 'shared/lib';
import CouldNotFindV4FireOnThePageError from './error';

export { CouldNotFindV4FireOnThePageError };

/**
 * Tries to detect V4Fire on the inspected page
 *
 * @param maxAttempts
 */
export function detectV4Fire(
	maxAttempts: number
): Promise<void> {

	// eslint-disable-next-line no-console
	console.log('trying to detect v4fire');

	const poll = (attempt: number) => new Promise(
		(resolve, reject) => checkIfV4FireIsPresentInInspectedWindow(resolve, reject)
	)
		.catch((error) => {
			// Retry
			if (error instanceof CouldNotFindV4FireOnThePageError && attempt < maxAttempts) {
				return new Promise((r) => setTimeout(r, 500)).then(() => poll(attempt + 1));
			}

			throw error;
		});

	return poll(1);
}

function checkIfV4FireIsPresentInInspectedWindow(
	onSuccess: Function,
	onError: (error: Error) => void
): void {
	browserAPI.devtools.inspectedWindow.eval<boolean>(
		// TODO: improve detection
		"typeof window.TPLS === 'object' && window.TPLS['i-block'] != null",
		(pageHasV4Fire, exceptionInfo) => {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (exceptionInfo != null) {
				const {code, description, isError, isException, value} = exceptionInfo;

				if (isException) {
					return onError(
						new Error(`Received error while checking if V4Fire has loaded: ${value}`)
					);
				}

				if (isError) {
					return onError(
						new Error(`Received error with code ${code} while checking if V4Fire has loaded: "${description}"`)
					);
				}
			}

			if (pageHasV4Fire) {
				return onSuccess();
			}

			onError(new CouldNotFindV4FireOnThePageError());
		}
	);
}
