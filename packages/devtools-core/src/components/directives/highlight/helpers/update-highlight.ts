/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

/**
 * Updates innerHTML of `el` with highlighted part
 *
 * @param el
 * @param text
 * @param indices
 */
export default function updateHighlight(el: Element, text: string, indices: [number, number]): void {
	const [startIndex, stopIndex] = indices;
	const children: HTMLElement[] = [];

	if (startIndex > 0) {
		const span = document.createElement('span');
		span.textContent = text.slice(0, startIndex);
		children.push(span);
	}

	const mark = document.createElement('mark');
	mark.textContent = text.slice(startIndex, stopIndex);
	mark.classList.add('g-highlight');
	children.push(mark);

	if (stopIndex < text.length) {
		const span = document.createElement('span');
		span.textContent = text.slice(stopIndex);
		children.push(span);
	}

	el.replaceChildren(...children);
}

