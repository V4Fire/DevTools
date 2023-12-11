/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { component } from 'components/super/i-block/i-block';
import Super from '@super/features/components/b-components-actions/b-components-actions';

import { devtoolsEval } from 'core/browser-api';

@component()
export default class bComponentsActions extends Super {
	override enableLocateComponent(): void {
		super.enableLocateComponent();

		// TODO: use InspectedApp interface
		devtoolsEval(() => globalThis.__V4FIRE_DEVTOOLS_BACKEND__.componentLocate.enable())
			.catch(stderr);
	}

	override disableLocateComponent(): void {
		super.disableLocateComponent();

		// TODO: use InspectedApp interface
		devtoolsEval(() => {
			globalThis.__V4FIRE_DEVTOOLS_BACKEND__.componentHighlight.hide();
			globalThis.__V4FIRE_DEVTOOLS_BACKEND__.componentLocate.disable();
		})
			.catch(stderr);
	}
}
