/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
import iStaticPage, { component, system } from 'components/super/i-static-page/i-static-page';

import createRouter from 'core/router/engines/in-memory';

import type bDynamicPage from 'components/base/b-dynamic-page/b-dynamic-page';

export * from 'components/super/i-static-page/i-static-page';

@component({root: true})
export default class pRoot extends iStaticPage {
	override readonly $refs!: iStaticPage['$refs'] & {
		page?: bDynamicPage;
	};

	/**
	 * The router engine
	 */
	@system()
	routerEngine: typeof createRouter = createRouter;
}
