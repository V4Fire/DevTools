/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import { getType } from '@v4fire/devtools-backend';

import { NBSP, normalizeComponentName } from 'core/helpers';

import type { Item, ComponentData } from 'features/components/b-components-panel/interface';
import type bComponentsPanel from 'features/components/b-components-panel/b-components-panel';

interface PanelItem {
	name: string;
	getValue(ctx: bComponentsPanel, data: ComponentData, key: string): {value: unknown; select?: Item['select']; warning?: Item['warning']};
	getDict(data: ComponentData): ComponentData[keyof ComponentData];
}

/**
 * The panel items that should display for the selected component
 */
const panelItems: PanelItem[] = [
	{
		name: 'props',
		getValue: (_ctx, data, key) => ({value: data.values[key]}),
		getDict: (data) => data.props
	},
	{
		name: 'fields',
		getValue: (_ctx, data, key) => ({value: data.values[key]}),
		getDict: (data) => data.fields
	},
	{
		name: 'computedFields',
		getValue: (_ctx, data, key) => ({value: data.values[key]}),
		getDict: (data) => data.computedFields
	},
	{
		name: 'mods',
		getValue: (ctx, data, key) => {
			let value = Object.isDictionary(data.values.mods) ? data.values.mods[key] : undefined;

			if (key in data.mods && Array.isArray(data.mods[key])) {
				const items = data.mods[key]!.map((decl) => {
					let declFormatted = String(decl);

					if (Array.isArray(decl)) {
						declFormatted = String(decl[0]);
						value ??= declFormatted;
					}

					return {label: declFormatted, value: declFormatted};
				});

				const select = {
					items,
					onActionChange: (_, value) => ctx.onChangeMod(key, value)
				};

				return {value, select};
			}

			return {value, warning: `Undeclared${NBSP}modifier`};
		},
		getDict: (data) => Object.mixin({}, {}, data.values.mods, data.mods)
	},
	{
		name: 'systemFields',
		getValue: (_ctx, data, key) => ({value: data.values[key]}),
		getDict: (data) => data.systemFields
	}
];

/**
 * Creates items from component data
 *
 * @param ctx
 * @param data
 */
export function createItems(ctx: bComponentsPanel, data: ComponentData): Item[] {
	const items: Item[] = [];

	const
		[block, ...rest] = data.componentName.split('-'),
		selfRegex = new RegExp(`^(i|${block})-${rest.join('-')}-?`);

	panelItems.forEach(({name, getValue, getDict}) => {
		const dict = getDict(data);
		const map = new Map<string, Item[]>();
		const children: Item[] = [];

		Object.keys(dict).forEach((key) => {
			if (key.startsWith('$')) {
				return;
			}

			// FIXME: correct component meta typings
			const
				{src} = (<{src?: string}><unknown>dict[key]),
				// Match intermediate classes
				isSelf = src == null || src.match(selfRegex) != null;

			const {value: valueByKey, select, warning} = getValue(ctx, data, key);
			const [value, valueChildren] = prepareValue(valueByKey, key);

			const item: Item = {
				label: key,
				data: value,
				children: valueChildren,
				select,
				warning
			};

			if (isSelf) {
				children.push(item);

			} else {
				const parent = normalizeComponentName(src);

				if (!map.has(parent)) {
					map.set(parent, []);
				}

				map.get(parent)?.push(item);
			}
		});

		data.hierarchy.forEach((parent) => {
			const childItems = map.get(parent);

			map.delete(parent);

			if (childItems != null) {
				children.push({
					label: parent.camelize(false),
					folded: true,
					children: childItems
				});
			}
		});

		items.push({
			label: name.camelize(true),
			value: name,
			folded: false,
			children
		});
	});

	return items;
}

/**
 * Returns prepare value with children in case if it is nested type
 *
 * @param value
 * @param path
 */
function prepareValue<T = unknown>(value: T, path: string): [T | string, CanUndef<Item[]>] {
	const isNested = (
		!Object.isPrimitive(value) &&
		// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
		!(String(value) === 'Function' && Object.hasOwnProperty.call(value, 'declaration')) &&
		(Object.isDictionary(value) || Object.isIterable(value))
	);

	if (isNested) {
		// Create children
		const items: Item[] = [];

		Object.forEach(value, (el, key) => {
			const label = String(key);
			const item: Item = {label};
			const [data, children] = prepareValue(el, `${path}.${label}`);

			item.data = data;
			item.children = children;

			items.push(item);
		});

		return [stringifyValue(value), items];
	}

	return [value, undefined];
}

/**
 * Returns type or stringified preview of the nested value
 *
 * @param value
 */
function stringifyValue(value: Dictionary | Iterable<unknown>): string {
	const size = Object.size(value);

	if (size === 0) {
		return JSON.stringify(value);
	}

	const type = getType(value);

	switch (type) {
		case 'Array':
		case 'Set':
			return `${type}(${size})`;

		case 'Object':
			if (size < 10) {
				try {
					const preview = JSON.stringify(value);
					return preview.length > 30 ? `${preview.slice(0, 30)}...}` : preview;
				} catch {}
			}

			return type;

		default:
			return type;
	}
}
