/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
import { devtoolsEval } from 'core/browser-api';
import type { DisposeEngine, EvaluateEngine } from 'core/inspect/devtools-handle/interface';

// eslint-disable-next-line @v4fire/require-jsdoc
export const evaluateEngine: EvaluateEngine = async (pageFunction, arg, handleId) => {
	return devtoolsEval(evalPageFunction, [pageFunction.toString(), arg, handleId]);

	function evalPageFunction(
		serializedPageFunction: string,
		arg: unknown,
		handleId?: string
	) {
		const target = handleId != null ? globalThis.__V4FIRE_DEVTOOLS_BACKEND__.handles.get(handleId) : null;

		if (handleId != null && target == null) {
			throw new Error('Handle target has been destroyed');
		}

		let func: Function;
		if (target != null) {
			// eslint-disable-next-line no-new-func
			func = new Function('arg', 'ctx', `return (${serializedPageFunction})(ctx, arg)`);

		} else {
			// eslint-disable-next-line no-new-func
			func = new Function('arg', `return (${serializedPageFunction})(arg)`);
		}

		try {
			const result = func(arg, target);

			return result;
		} catch (error) {
			throw new Error('Failed to evaluate the function', {cause: error});
		}
	}
};

// eslint-disable-next-line @v4fire/require-jsdoc
export const disposeEngine: DisposeEngine = async (handleId) => devtoolsEval((handleId) => {
	globalThis.__V4FIRE_DEVTOOLS_BACKEND__.handles.delete(handleId);
}, [handleId]);
