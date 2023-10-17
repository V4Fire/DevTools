/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
import iStaticPage, { component } from 'components/super/i-static-page/i-static-page';

export * from 'components/super/i-static-page/i-static-page';

@component({root: true})
export default class pRoot extends iStaticPage {
	override readonly $refs!: iStaticPage['$refs'] & {};
}
