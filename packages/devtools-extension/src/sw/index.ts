/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import BrowserTabManager from './browser/browser-tab-manager';
import RuntimeMessageHandler from './browser/runtime-message-handler';

const
	browserTabManager = new BrowserTabManager(),
	runtimeMessageHandler = new RuntimeMessageHandler();

browserTabManager.listen();
runtimeMessageHandler.listen();
