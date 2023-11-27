/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
import iStaticPage, { component, system, field, hook } from 'components/super/i-static-page/i-static-page';

import createRouter from 'core/router/engines/in-memory';

import type bHeader from 'components/widgets/b-header/b-header';
import type bDynamicPage from 'components/base/b-dynamic-page/b-dynamic-page';

export * from 'components/super/i-static-page/i-static-page';

@component({root: true})
export default class pRoot extends iStaticPage {
	override readonly $refs!: iStaticPage['$refs'] & {
		header?: bHeader;
		page?: bDynamicPage;
	};

	/**
	 * Placeholder title used when application can't be rendered
	 */
	@field()
	placeholder: string = '';

	/**
	 * The router engine
	 */
	@system()
	routerEngine: typeof createRouter = createRouter;

	/**
	 * Sets `--header-height` css variable
	 */
	@hook('mounted')
	async init(): Promise<void> {
		const header = await this.waitRef<bHeader>('header');

		(<HTMLElement>this.$el).style.setProperty('--header-height', `${header.$el?.clientHeight ?? 0}px`);
	}
}
