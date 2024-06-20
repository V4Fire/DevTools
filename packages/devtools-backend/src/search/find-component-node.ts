/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import type { ComponentQuery } from '../interface';

/**
 * Find component DOM node
 *
 * @param query - component query
 */
export default function findComponentNode<T extends Element>(query: ComponentQuery): T | null {
	const {componentId: id, componentName: name} = query;
	let node = Array.prototype.find.call(
		document.querySelectorAll(`.i-block-helper.${id}`),
		(node) => node.component?.componentId === id
	);

	if (node == null && name != null) {
		// Maybe it's a functional component
		const nodes = document.querySelectorAll(`.i-block-helper.${name}`);
		node = Array.prototype.find.call(nodes, (node) => node.component?.componentId === id);
	}

	return node;
}
