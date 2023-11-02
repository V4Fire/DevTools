/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { devtoolsEval, pageHasV4Fire } from 'shared/lib';
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
	devtoolsEval(pageHasV4Fire)
		.then((result) => {
			if (result) {
				onSuccess();
			} else {
				onError(new CouldNotFindV4FireOnThePageError());
			}
		})
		.catch((error) => {
			onError(
				new Error(
					`Received error while checking if V4Fire has loaded: ${error.message}`,
					{cause: error}
				)
			);
		});
}
