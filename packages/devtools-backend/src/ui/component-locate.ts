/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { componentHighlight } from './component-highlight';

interface ComponentInterface {
	componentId: string;
	componentName: string;
}

class ComponentLocate {
	#mouseoverListener: ((e: MouseEvent) => void) | null = null;

	#clickListener: ((e: MouseEvent) => void) | null = null;

	enable() {
		this.disable();

		let component: ComponentInterface | null = null;

		this.#mouseoverListener = (e: MouseEvent) => {
			component = e.target instanceof Element ? findComponent(e.target) : null;

			if (component != null) {
				const {componentId, componentName} = component;
				componentHighlight.show(componentId, componentName);

			} else {
				componentHighlight.hide();
			}
		};

		this.#clickListener = (e) => {
			e.preventDefault();
			e.stopPropagation();

			this.disable();

			if (component != null) {
				componentHighlight.hide({animate: true});

				const {componentId, componentName} = component;

				// TODO: create bridge
				globalThis.postMessage({
					source: 'v4fire-devtools-bridge',
					payload: {
						event: 'select-component',
						payload: {componentId, componentName}
					}
				}, '*');
			}
		};

		document.addEventListener('mouseover', this.#mouseoverListener);
		document.addEventListener('click', this.#clickListener, {capture: true});
	}

	disable() {
		if (this.#mouseoverListener != null) {
			document.removeEventListener('mouseover', this.#mouseoverListener);
			this.#mouseoverListener = null;
		}

		if (this.#clickListener != null) {
			document.removeEventListener('click', this.#clickListener, {capture: true});
			this.#clickListener = null;
		}
	}
}

export const componentLocate = new ComponentLocate();

function findComponent(target: Element | null): ComponentInterface | null {
	let component: ComponentInterface | null = null;

	while (component == null && target != null) {
		const node: Element & {component?: ComponentInterface} | null = target.closest('.i-block-helper');

		if (node == null) {
			break;
		}

		if (node.component != null) {
			({component} = node);

		} else {
			// If `component` property is missing - search higher in hierarchy
			target = <Element>node.parentNode;
		}
	}

	return component;
}
