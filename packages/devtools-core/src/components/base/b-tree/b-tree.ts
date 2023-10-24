/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import Super, { component } from '@super/components/base/b-tree/b-tree';

export * from '@super/components/base/b-tree/b-tree';

@component()
export default class bTree extends Super {
	protected override getItemProps(item: this['Item'], i: number): Dictionary {
		const
			op = this.itemProps,
			props = Object.reject(item, ['children', 'folded']);

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
