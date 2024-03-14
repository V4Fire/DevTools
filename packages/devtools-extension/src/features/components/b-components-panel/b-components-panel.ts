/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
import { devtoolsEval } from 'core/browser-api';

import iBlock, { component } from 'components/super/i-block/i-block';

import Super from '@super/features/components/b-components-panel/b-components-panel';

@component()
export default class bComponentsPanel extends Super {
	override onChangeMod(key: string, value: unknown): void {
		const {componentId, componentName} = this.componentData;

		devtoolsEval(evalSetComponentMod, [key, value, componentId, componentName])
			.catch(stderr);
	}

	protected override onInspect(): void {
		const {componentId, componentName} = this.componentData;

		devtoolsEval(evalInspect, [componentId, componentName])
			.catch(stderr);
	}
}

function evalInspect(componentId: string, componentName: string): void {
	// eslint-disable-next-line @typescript-eslint/method-signature-style
	const {inspect} = <{inspect?: (el: Element) => void} & Global>globalThis;

	if (typeof inspect !== 'function') {
		// eslint-disable-next-line no-alert
		alert('Browser doesn\'t provide inspect util');
		return;
	}

	const node = globalThis.__V4FIRE_DEVTOOLS_BACKEND__.findComponentNode(componentId, componentName);

	if (node != null) {
		inspect(node);

	} else {
		// eslint-disable-next-line no-alert
		alert('Component\'s node not found');
	}
}

function evalSetComponentMod(key: string, value: unknown, componentId: string, componentName: string) {
	const node = globalThis.__V4FIRE_DEVTOOLS_BACKEND__.findComponentNode(componentId, componentName);

	if (node == null) {
		return;
	}

	const {component} = <{component?: iBlock} & Element>node;

	if (component != null) {
		void component.setMod(key, value);
	}
}
