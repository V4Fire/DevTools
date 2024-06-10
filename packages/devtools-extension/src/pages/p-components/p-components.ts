/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { devtoolsEval } from 'core/browser-api';

import type iBlock from 'components/super/i-block/i-block';

import Super, { component, hook } from '@super/pages/p-components/p-components';

import type { Item } from 'features/components/b-components-tree/b-components-tree';

@component()
export default class pComponents extends Super {
	@hook('beforeCreate')
	loadComponentsTree(): void {
		devtoolsEval(evalComponentsTree)
			.then((result) => {
				this.field.set('components', result);
			})
			.catch((error) => {
				// eslint-disable-next-line no-alert
				globalThis.alert(error.message);
			});
	}
}

function evalComponentsTree(): Item[] {
	const nodes: Array<{component: iBlock}> = Array.prototype.filter.call(
		document.getElementsByClassName('i-block-helper'),
		(node) => node.component !== undefined
	);

	// Calc min renderCounter
	let minRenderCounter = Number.MAX_SAFE_INTEGER;

	nodes.forEach(({component}) => {
		const {$renderCounter} = component.unsafe;

		if ($renderCounter < minRenderCounter) {
			minRenderCounter = $renderCounter;
		}
	});

	const map = new Map();

	const createDescriptor = (component: iBlock) => {
		const {meta, $renderCounter} = component.unsafe;

		const descriptor: Item = {
			value: component.componentId,
			label: meta.componentName,
			children: [],

			// Specific props
			componentName: meta.componentName,
			renderCounterProp: $renderCounter,
			isFunctionalProp: component.isFunctional,
			showWarning: $renderCounter > minRenderCounter
		};

		return descriptor;
	};

	const
		rootNodeIndex = nodes.findIndex(({component}) => component.unsafe.meta.params.root),
		rootNode = nodes[rootNodeIndex];

	nodes.splice(rootNodeIndex, 1);
	map.set(rootNode.component.componentId, createDescriptor(rootNode.component));

	const buffer: Function[] = [];

	// Build tree
	nodes.forEach(({component}) => {
		const descriptor = createDescriptor(component);

		// Teleported components may appear more than once
		if (map.has(component.componentId)) {
			return;
		}

		map.set(component.componentId, descriptor);

		const parentId = component.$parent?.componentId;

		if (parentId != null) {
			if (!map.has(parentId)) {
				buffer.push(() => {
					const item = map.get(parentId);

					if (item != null) {
						item.children.push(descriptor);

					} else {
						stderr(`Missing parent, component: ${component.componentName}, parent id: ${parentId}`);
					}
				});

			} else {
				map.get(parentId).children.push(descriptor);
			}
		}
	});

	buffer.forEach((cb) => cb());

	const root = map.values().next().value;

	return root != null ? [root] : [];
}
