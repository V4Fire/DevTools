/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { deserialize } from '@v4fire/devtools-backend';
import { devtoolsEval } from 'shared/lib';

import type iBlock from 'components/super/i-block/i-block';

import Super, { component, hook, field, ComponentInterface } from '@super/pages/p-components/p-components';

import type { Item } from 'features/components/b-components-tree/b-components-tree';

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
				this.field.set('components', result);
				this.field.set('error', null);
			})
			.catch((error) => {
				this.field.set('error', error.message);
			});
	}

	override async loadSelectedComponentData(): Promise<void> {
		const value = this.selectedComponentId!;
		// FIXME: bad encapsulation
		const item = this.$refs.components?.$refs.tree?.getItemByValue(value);

		const serializedData = await devtoolsEval(evalComponentMeta, [value, <string>item?.componentName]);

		if (serializedData == null) {
			// TODO: show custom toast or alert in devtools
			// eslint-disable-next-line no-alert
			globalThis.alert('No data');
			return;
		}

		this.selectedComponentData = deserialize(serializedData);
	}
}

function evalComponentsTree(): Item[] {
	const nodes: Array<{component: iBlock}> = Array.prototype.filter.call(
		document.getElementsByClassName('i-block-helper'),
		(node) => node.component !== undefined
	);

	const map = new Map();

	// Calc min renderCounter
	let minRenderCounter = Number.MAX_SAFE_INTEGER;

	nodes.forEach(({component}) => {
		const {$renderCounter} = component.unsafe;

		if ($renderCounter < minRenderCounter) {
			minRenderCounter = $renderCounter;
		}
	});

	// Build tree
	nodes.forEach(({component}) => {
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

		map.set(component.componentId, descriptor);

		const parentId = component.$parent?.componentId;

		if (parentId != null) {
			map.get(parentId).children.push(descriptor);
		}
	});

	const root = map.values().next().value;

	return root != null ? [root] : [];
}

// TODO: create container type
function evalComponentMeta(value: string, name?: string): Nullable<string> {
	const restricted = new Set([
		'r',
		'self',
		'unsafe',
		'window',
		'document',
		'console',
		'router',
		'LANG_PACKS'
	]);

	let node = document.querySelector(`.i-block-helper.${value}`);

	if (node == null && name != null) {
		// Maybe it's a functional component
		const nodes = document.querySelectorAll(`.i-block-helper.${name}`);
		node = Array.prototype.find.call(nodes, (node) => node.component?.componentId === value);
	}

	if (node == null) {
		return null;
	}

	const {component} = <{component?: ComponentInterface} & Element>node;

	if (component == null) {
		throw new Error('DOM node doesn\'t have component property');
	}

	const {componentName, props, fields, computedFields, systemFields} = component.unsafe.meta;

	const values = {};

	[props, fields, computedFields, systemFields].forEach((dict) => {
		Object.keys(dict).forEach((key) => {
			if (!restricted.has(key)) {
				values[key] = component[key];
			}
		});
	});

	const hierarchy: string[] = [];

	let parent = component.unsafe.meta.parentMeta;
	while (parent != null) {
		hierarchy.push(parent.componentName);
		parent = parent.parentMeta;
	}

	const result = {componentName, props, fields, computedFields, systemFields, hierarchy, values};

	return globalThis.__V4FIRE_DEVTOOLS_BACKEND__.serialize(result, (key) => key.startsWith('$') || restricted.has(key));
}
