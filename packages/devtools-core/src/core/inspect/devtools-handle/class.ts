/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { disposeEngine, evaluateEngine } from 'core/inspect/devtools-handle/engines';
import type { PageFunctionWithCtx } from 'core/inspect/devtools-handle/interface';

export default class DevtoolsHandle<Ctx> {
	/**
	 * The id of the handle. This id is used as the key to reference the handled object
	 */
	protected readonly id!: string;

	constructor(id: string) {
		this.id = id;
	}

	/**
	 * Returns the return value of the `pageFunction`
	 *
	 * @param pageFunction
	 * @param arg
	 */
	evaluate<T = unknown, Arg = unknown>(
		pageFunction: PageFunctionWithCtx<Ctx, T, Arg>,
		arg?: Arg
	): Promise<T> {
		return evaluateEngine<T, Arg, Ctx>(pageFunction, arg, this.id);
	}

	/**
	 * The method stops referencing the handled object
	 */
	dispose(): Promise<void> {
		return disposeEngine(this.id);
	}
}
