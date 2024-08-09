/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { devtoolsEval } from 'core/browser-api';

import { component } from 'components/super/i-block/i-block';

import Super from '@super/features/components/b-components-tree/b-components-tree';

export * from '@super/features/components/b-components-tree/b-components-tree';

@component()
export default class bComponentsTree extends Super {
	/**
	 * Hide highlight for the component
	 */
	protected override onItemMouseLeave(): void {
		devtoolsEval(evalHideComponentHighlight).catch(stderr);
	}
}

function evalHideComponentHighlight(): void {
	globalThis.__V4FIRE_DEVTOOLS_BACKEND__.componentHighlight.hide();
}
