/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import bTree, { component, system } from 'components/base/b-tree/b-tree';
import type { Item } from 'features/components/b-components-tree/interface';

export * from 'features/components/b-components-tree/interface';

@component()
export default class bComponentsTree extends bTree {
	override readonly Item!: Item;

	@system()
	override readonly item: string = 'b-components-tree-item';

	@system()
	override childrenTreeComponent: string = 'b-components-tree';

	protected override getItemProps(item: this['Item'], i: number): Dictionary {
		const
			op = this.itemProps,
			props = Object.reject(item, ['children', 'folded', 'componentName', 'value', 'parentValue']);

		if (op == null) {
			return props;
		}

		return Object.isFunction(op) ?
			op(item, i, {
				key: this.getItemKey(item, i),
				ctx: this,
				...props
			}) :

			Object.assign(props, op);
	}
}
