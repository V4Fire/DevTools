/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
import type { EvaluateEngine, DisposeEngine } from 'core/inspect/devtools-handle/interface';

// eslint-disable-next-line @v4fire/require-jsdoc
export const evaluateEngine: EvaluateEngine = () => Object.cast(Promise.resolve(undefined));

// eslint-disable-next-line @v4fire/require-jsdoc
export const disposeEngine: DisposeEngine = () => Promise.resolve();
