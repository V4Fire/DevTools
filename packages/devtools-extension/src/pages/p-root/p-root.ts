/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
import Super, { component, hook } from '@super/pages/p-root/p-root';
import { devtoolsEval } from 'shared/lib';

export * from '@super/pages/p-root/p-root';

@component()
export class pRoot extends Super {
	@hook('created')
	checkPreconditions(): void {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		devtoolsEval(() => globalThis.__V4FIRE_DEVTOOLS_BACKEND__ != null)
			.then((result) => {
				if (!result) {
					this.placeholder = 'V4Fire Devtools Backend is not detected on the page, try to reload the page and re-open the devtools';
				}
			})
			.catch(stderr);
	}
}
