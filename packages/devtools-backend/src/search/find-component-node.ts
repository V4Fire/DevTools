/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

/**
 * Find component DOM node
 *
 * @param id - component id
 * @param name - component name
 */
export default function findComponentNode<T extends Element>(id: string, name?: string): T | null {
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
