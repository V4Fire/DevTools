/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { deserialize } from '@v4fire/devtools-backend';
import Super, { component, hook, field, ComponentInterface, ComponentMeta } from '@super/pages/p-components/p-components';

// FIXME: incorrectly derived type when importing from `components/base...`
import type { Item } from '@v4fire/client/components/base/b-tree/b-tree';

import { devtoolsEval } from 'shared/lib';

type ComponentData = Pick<
	ComponentMeta, 'componentName' | 'props' | 'fields' | 'computedFields'
> & { values: Dictionary };

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

	override async loadSelectedComponentMeta(): Promise<void> {
		const value = this.selectedComponentId!;
		const item = this.$refs.tree?.getItemByValue(value);

		const serializedData = await devtoolsEval(evalComponentMeta, [value, <string>item?.componentName]);

		if (serializedData == null) {
			// TODO: show toast or alert in devtools
			stderr('No data');
			return;
		}

		const data = deserialize<ComponentData>(serializedData);

		const
			meta: Item[] = [];

		const
			[block, ...rest] = data.componentName.split('-'),
			selfRegex = new RegExp(`^(i|${block})-${rest.join('-')}-?`);

		['props', 'fields', 'computedFields'].forEach((name) => {
			const dict = data[name];
			const map = new Map<string, Item[]>();
			const children: Item[] = [];

			Object.keys(dict).forEach((key) => {
				// FIXME: correct component meta typings
				const {src} = (<{src: string}><unknown>dict[key]);
				const isSelf = src.match(selfRegex) != null;

				if (isSelf) {
					children.push({label: key, data: data.values[key]});
				} else {
					let parentSrc = src.camelize(false);

					// Normalize parent src
					const matches = /^(i-block|i-data)/.exec(src);
					if (matches != null) {
						parentSrc = matches[1].camelize(false);
					}

					if (!map.has(parentSrc)) {
						map.set(parentSrc, []);
					}

					map.get(parentSrc)?.push({
						label: key,
						data: data.values[key]
					});
				}
			});

			// TODO: make sorted
			for (const [parent, items] of map.entries()) {
				children.push({
					label: parent,
					folded: true,
					children: items
				});
			}

			meta.push({
				label: name.camelize(true),
				value: name,
				folded: false,
				children
			});
		});

		this.selectedComponentMeta = meta;
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
			componentName: component.meta.componentName,
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

// TODO: create container type
function evalComponentMeta(value: string, name?: string): Nullable<string> {
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

	// TODO: support system fields
	const {componentName, props, fields, computedFields} = component.unsafe.meta;

	const values = {};

	[props, fields, computedFields].forEach((dict) => {
		Object.keys(dict).forEach((key) => {
			values[key] = component[key];
		});
	});

	const result = {componentName, props, fields, computedFields, values};

	return globalThis.__V4FIRE_DEVTOOLS_BACKEND__.serialize(result);
}
