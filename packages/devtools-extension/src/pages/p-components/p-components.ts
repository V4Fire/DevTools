/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import Super, { component, hook, field } from '@super/pages/p-components/p-components';

import type { Item } from 'components/base/b-tree/b-tree';

import { devtoolsEval } from 'shared/lib';

@component()
export default class pComponents extends Super {

	/**
	 * Displays an error on the page
	 */
	@field()
	error: string | null = null;

	@hook('beforeCreate')
	loadComponentsTree(): void {
		devtoolsEval(evalComponentsTree)
			.then((result) => {
				this.field.set('tree', result);
				this.field.set('error', null);
			})
			.catch((error) => {
				this.field.set('error', error.message);
			});
	}
}

function evalComponentsTree(): Item[] {
	const nodes = Array.prototype.filter.call(
		document.getElementsByClassName('i-block-helper'),
		(node) => node.component !== undefined
	);

	const map = new Map();

	nodes.forEach(({component}) => {
		const descriptor = {
			value: component.componentId,
			label: component.meta.name,
			children: [],

			// Specific props
			renderCount: component.renderCount
		};

		map.set(component.componentId, descriptor);

		const parentId = component.$parent?.componentId;
		if (parentId != null) {
			map.get(parentId).children.push(descriptor);
		}
	});

	const root = map.values().next().value;

	return root != null ? [root] : [];
}
