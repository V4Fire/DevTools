/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import symbolGenerator from 'core/symbol';
import type { ComponentHandle } from 'core/inspect';
import iDynamicPage, { component, field, watch } from 'components/super/i-dynamic-page/i-dynamic-page';

import type { Item } from 'components/base/b-tree/b-tree';
import type { ComponentData } from 'features/components/b-components-panel/b-components-panel';
import type bComponentsTree from 'features/components/b-components-tree/b-components-tree';
import type bComponentsPanel from 'features/components/b-components-panel/b-components-panel';

export * from 'components/super/i-dynamic-page/i-dynamic-page';

const $$ = symbolGenerator();

@component()
export default class pComponents extends iDynamicPage {
	override readonly $refs!: iDynamicPage['$refs'] & {
		components?: bComponentsTree;
		panel?: bComponentsPanel;
	};

	/**
	 * Component tree
	 */
	@field()
	components: Item[] = [];

	/**
	 * Selected component handle
	 */
	@field()
	selectedComponent: ComponentHandle | null = null;

	/**
	 * Selected component meta
	 */
	@field()
	selectedComponentData: ComponentData | null = null;

	/**
	 * Handle component select
	 *
	 * @param _
	 * @param component
	 */
	@watch('?$refs.components:change')
	onComponentSelect(_: unknown, component: ComponentHandle): void {
		this.selectedComponent = component;
		this.selectedComponentData = null;

		const load = this.async.throttle(async () => {
			try {
				await this.loadSelectedComponentData();
			} catch (error) {
				// eslint-disable-next-line no-alert
				globalThis.alert(`Failed to load data, reason: ${error.message}`);
				stderr(error);
			}
		}, 1000, {label: $$.loadSelectedComponentMeta});

		load();
	}

	/**
	 * Loads selected component data
	 */
	async loadSelectedComponentData(): Promise<void> {
		const data = await this.selectedComponent?.getData();

		if (data == null) {
			// eslint-disable-next-line no-alert
			globalThis.alert('No data');

		} else {
			this.selectedComponentData = data;
		}
	}

}
