/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { ComponentEngine, VNode } from 'core/component/engines';

import type { DirectiveParams } from 'components/directives/highlight/interface';
import { closestSearchTrait, updateHighlight } from 'components/directives/highlight/helpers';

export * from 'components/directives/highlight/interface';

const elementListeners = new WeakMap<
	Element,
	Map<string, (...args: any[]) => any>
>();

ComponentEngine.directive('highlight', {
	mounted(el: Element, params: DirectiveParams, vnode: VNode): void {
		const searchComponent = closestSearchTrait(vnode);
		const {localEmitter: emitter} = searchComponent.unsafe;
		const {id, text} = params.value;

		if (!elementListeners.has(el)) {
			elementListeners.set(el, new Map());
		}

		const listeners = elementListeners.get(el)!;

		const
			resetEvent = 'highlight-reset',
			resetListener = () => el.textContent = text;

		if (listeners.has(resetEvent)) {
			emitter.off(resetEvent, listeners.get(resetEvent));
		}

		listeners.set(resetEvent, resetListener);
		emitter.on(resetEvent, resetListener);

		if (id != null) {
			emitter.on(`highlight.${id}`, (indices: [number, number] | null) => {
				if (indices != null) {
					updateHighlight(el, text, indices);

				} else {
					el.textContent = text;
				}
			}, {label: `highlight.${id}`});

			emitter.on(`highlight-current.${id}`, (selected: boolean) => {
				const mark = el.querySelector('.g-highlight');
				if (!selected) {
					mark?.classList.remove('g-highlight_selected_true');

				} else {
					mark?.classList.add('g-highlight_selected_true');
				}
			}, {label: `highlight-current.${id}`});

		} else {
			const highlightEvent = 'highlight';
			const highlightListener = () => {
				const indices = searchComponent.search.matchText(text);

				if (indices[0] !== -1) {
					updateHighlight(el, text, indices);

				} else {
					el.textContent = text;
				}
			};

			if (listeners.has(highlightEvent)) {
				emitter.off(highlightEvent, listeners.get(highlightEvent));
			}

			listeners.set(highlightEvent, highlightListener);
			emitter.on(highlightEvent, highlightListener);
		}
	},

	unmounted(el: Element, params: DirectiveParams, vnode: VNode): void {
		const searchComponent = closestSearchTrait(vnode);
		const {localEmitter: emitter} = searchComponent.unsafe;
		const {id} = params.value;

		for (const [event, listener] of elementListeners.get(el) ?? []) {
			emitter.off(event, listener);
		}

		elementListeners.delete(el);

		if (id != null) {
			emitter.off({label: `highlight.${id}`});
			emitter.off({label: `highlight.current.${id}`});
		}
	}
});

