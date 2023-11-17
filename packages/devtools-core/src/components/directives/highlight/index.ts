/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { ComponentEngine, VNode } from 'core/component/engines';

import type { DirectiveParams, HighlightEmitter, HighlightEvents } from 'components/directives/highlight/interface';
import { closestSearchTrait, updateHighlight } from 'components/directives/highlight/helpers';

export * from 'components/directives/highlight/interface';

const elementListeners = new WeakMap<
	Element,
	Map<keyof HighlightEvents, (...args: any[]) => any>
>();

ComponentEngine.directive('highlight', {
	mounted(el: Element, params: DirectiveParams, vnode: VNode): void {
		const searchComponent = closestSearchTrait(vnode);
		const emitter: HighlightEmitter = Object.cast(searchComponent.unsafe.localEmitter);
		const {id, text} = params.value;

		if (!elementListeners.has(el)) {
			elementListeners.set(el, new Map());
		}

		const listeners = elementListeners.get(el)!;

		const
			resetEvent: keyof HighlightEvents = 'highlight-reset',
			resetListener = () => el.textContent = text;

		listeners.set(resetEvent, resetListener);
		emitter.on(resetEvent, resetListener);

		if (id != null) {
			emitter.on(`highlight.${id}`, (indices) => {
				if (indices != null) {
					updateHighlight(el, text, indices);

				} else {
					el.textContent = text;
				}
			});

			emitter.on(`highlight-current.${id}`, (selected) => {
				const mark = el.querySelector('.g-highlight');

				if (!selected) {
					mark?.classList.remove('g-highlight_selected_true');

				} else {
					mark?.classList.add('g-highlight_selected_true');
				}
			});

		} else {
			const highlightEvent: keyof HighlightEvents = 'highlight';
			const highlightListener = () => {
				const indices = searchComponent.search.matchText(text);

				if (indices[0] !== -1) {
					updateHighlight(el, text, indices);

				} else {
					el.textContent = text;
				}
			};

			listeners.set(highlightEvent, highlightListener);
			emitter.on(highlightEvent, highlightListener);
		}
	},

	unmounted(el: Element, params: DirectiveParams, vnode: VNode): void {
		const searchComponent = closestSearchTrait(vnode);
		const emitter: HighlightEmitter = Object.cast(searchComponent.unsafe.localEmitter);
		const {id} = params.value;

		for (const [event, listener] of elementListeners.get(el) ?? []) {
			emitter.off(event, listener);
		}

		elementListeners.delete(el);

		if (id != null) {
			emitter.removeAllListeners(`highlight.${id}`);
			emitter.removeAllListeners(`highlight.current.${id}`);
		}
	}
});

