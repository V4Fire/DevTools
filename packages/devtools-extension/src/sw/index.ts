/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import 'sw/init/inject-content-scripts';

import BrowserTabManager from 'sw/browser/tab-manager';
import RuntimeMessageHandler from 'sw/browser/runtime-message-handler';

const
	browserTabManager = new BrowserTabManager(),
	runtimeMessageHandler = new RuntimeMessageHandler();

browserTabManager.listen();
runtimeMessageHandler.listen();
