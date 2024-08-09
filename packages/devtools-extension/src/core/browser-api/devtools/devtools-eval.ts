/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
import { browserAPI } from 'core/browser-api';

/**
 * Evaluates given function in context of inspectedWindow
 *
 * @param func
 * @param args
 */
function devtoolsEval<F extends (...args: any) => JSONLikeValue | Array<Dictionary<unknown>> | void>(
	func: F,
	args?: Parameters<F>
): Promise<ReturnType<F>>;

/**
 * Promisified version of `chrome.devtools.inspectedWindow.eval`
 * Prefer using the content scripts instead of devtools eval.
 *
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/devtools/inspectedWindow/eval
 * @param expression
 */
function devtoolsEval<T = unknown>(expression: string): Promise<T>;

function devtoolsEval(expressionOrFunction: string | Function, args?: any[]): Promise<unknown> {
	let expression = '';

	if (typeof expressionOrFunction === 'function') {
		expression = `(${expressionOrFunction.toString()})(...${JSON.stringify(args ?? [])})`;
	} else {
		expression = expressionOrFunction;
	}

	return new Promise((resolve, reject) => {
		browserAPI.devtools.inspectedWindow.eval(expression, (result, exceptionInfo) => {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (exceptionInfo != null) {
				const {code, description, isError, isException, value} = exceptionInfo;

				if (isException) {
					reject(
						new Error(`Received error on devtools eval: ${value}`)
					);

				} else if (isError) {
					reject(
						new Error(`Received error with code ${code} on devtools eval: "${description}"`)
					);

				} else {
					reject(new Error('Unexpected error during devtools eval'));
				}

			} else {
				resolve(Object.cast(result));
			}
		});
	});
}

export default devtoolsEval;
