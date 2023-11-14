/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { globalEmitter } from 'core/component';

import { ComponentEngine } from 'core/component/engines';

import { matchText } from 'components/directives/highlight/helpers';
import type { DirectiveParams, HighlightEmitter, HighlightEvents } from 'components/directives/highlight/interface';

export * from 'components/directives/highlight/interface';

const elementListeners = new WeakMap<
	Element,
	Map<keyof HighlightEvents, (...args: any[]) => any>
>();

ComponentEngine.directive('highlight', {
	mounted(el: Element, params: DirectiveParams): void {
		const emitter = params.value.emitter ?? <HighlightEmitter><unknown>globalEmitter;
		const {id, text, ctx} = params.value;

		if (!elementListeners.has(el)) {
			elementListeners.set(el, new Map());
		}

		const listeners = elementListeners.get(el)!;

		const
			resetEvent: keyof HighlightEvents = `highlight:${ctx}:reset`,
			resetListener = () => el.textContent = text;

		listeners.set(resetEvent, resetListener);
		emitter.on(resetEvent, resetListener);

		if (id != null) {
			emitter.on(`highlight:${ctx}:${id}`, (indices) => {
				if (indices != null) {
					updateHighlight(el, text, indices);
				} else {
					el.textContent = text;
				}
			});

		} else {
			const highlightEvent: keyof HighlightEvents = `highlight:${ctx}`;
			const highlightListener = (matchQuery: RegExp | string) => {
				const indices = matchText(text, matchQuery);

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

	unmounted(el: Element, params: DirectiveParams): void {
		const emitter = params.value.emitter ?? <HighlightEmitter><unknown>globalEmitter;
		const {id, ctx} = params.value;

		for (const [event, listener] of elementListeners.get(el) ?? []) {
			emitter.off(event, listener);
		}

		elementListeners.delete(el);

		if (id != null) {
			emitter.removeAllListeners(`highlight:${ctx}:${id}`);
		}
	}
});

function updateHighlight(el: Element, text: string, indices: [number, number]): void {
	const [startIndex, stopIndex] = indices;
	const children: HTMLElement[] = [];

	if (startIndex > 0) {
		const span = document.createElement('span');
		span.textContent = text.slice(0, startIndex);
		children.push(span);
	}

	const mark = document.createElement('mark');
	mark.textContent = text.slice(startIndex, stopIndex);
	children.push(mark);

	if (stopIndex < text.length) {
		const span = document.createElement('span');
		span.textContent = text.slice(stopIndex);
		children.push(span);
	}

	el.replaceChildren(...children);
}

