/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import findComponentNode from '../search/find-component-node';

interface HideOptions {
	animate?: boolean;
	delay?: number;
}

const
	highlightNodeId = 'v4fire-devtools-highlight',
	highlightAnimationDuration = 300;

class ComponentHighlight {
	/**
	 * Highlight animation timeout
	 */
	#animationTimeout: any;

	/**
	 * Show highlight for the component
	 *
	 * @param componentId
	 * @param componentName
	 */
	show(componentId: string, componentName: string): void {
		const node = findComponentNode<HTMLElement>(componentId, componentName);

		if (node == null) {
			return;
		}

		clearTimeout(this.#animationTimeout);

		const highlightNode = getOrCreateHighlightNode();

		const {width, height, top, left} = node.getBoundingClientRect();
		highlightNode.style.width = `${width}px`;
		highlightNode.style.height = `${height}px`;
		highlightNode.style.top = `${(globalThis.scrollY + top)}px`;
		highlightNode.style.left = `${left}px`;
		highlightNode.style.opacity = '1';
		highlightNode.style.display = 'block';
	}

	/**
	 * Hide component's highlight
	 * @param animateOrOptions
	 */
	hide(animateOrOptions?: boolean | HideOptions): void {
		let animate = false;
		let delay: number | null = null;

		if (typeof animateOrOptions === 'boolean') {
			animate = animateOrOptions;

		} else if (typeof animateOrOptions === 'object') {
			({animate = false, delay = null} = animateOrOptions);
		}

		const node = document.getElementById(highlightNodeId);

		if (node == null) {
			return;
		}

		if (animate) {
			clearTimeout(this.#animationTimeout);

			const end = () => {
				this.#animationTimeout = setTimeout(() => {
					node.style.display = 'none';
				}, highlightAnimationDuration);
			};

			const start = () => {
				node.style.opacity = '0';

				end();
			};

			if (delay != null) {
				this.#animationTimeout = setTimeout(start, delay);
			} else {
				start();
			}

		} else {
			node.style.display = 'none';
		}
	}
}

export const componentHighlight = new ComponentHighlight();

function getOrCreateHighlightNode(): HTMLElement {
	let highlightNode = document.getElementById(highlightNodeId);

	if (highlightNode == null) {
		highlightNode = document.createElement('div');
		highlightNode.id = highlightNodeId;
		highlightNode.style.position = 'absolute';
		highlightNode.style.display = 'none';
		highlightNode.style.backgroundColor = 'rgba(250, 0, 250, 0.3)';
		highlightNode.style.zIndex = '9999';
		highlightNode.style.transition = `opacity ${highlightAnimationDuration}ms ease`;
		document.body.appendChild(highlightNode);
	}

	return highlightNode;
}
