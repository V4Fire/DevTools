/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
export interface PageFunction<T, Arg = unknown> {
	(arg: Arg): T;
}

export interface PageFunctionWithCtx<Ctx, T, Arg = unknown> {
	(ctx: Ctx, arg: Arg): T;
}

export interface EvaluateEngine {
	<T, Arg = unknown, Ctx = unknown>(
		pageFunction: PageFunction<T, Arg> | PageFunctionWithCtx<Ctx, T, Arg>,
		arg?: Arg,
		handleId?: string
	): Promise<T>;
}

export interface DisposeEngine {
	(handleId: string): Promise<void>;
}
