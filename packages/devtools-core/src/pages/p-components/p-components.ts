/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import symbolGenerator from 'core/symbol';
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
	 * Selected component id
	 */
	@field()
	selectedComponentId: string | null = null;

	/**
	 * Selected component meta
	 */
	@field()
	selectedComponentData: ComponentData | null = null;

	/**
	 * Handle component select
	 *
	 * @param _
	 * @param componentId
	 */
	@watch('?$refs.components:change')
	onComponentSelect(_: unknown, componentId: string): void {
		this.selectedComponentId = componentId;
		this.selectedComponentData = null;

		const load = this.async.throttle(async () => {
			try {
				await this.loadSelectedComponentData();
			} catch (error) {
				// TODO: show alert
				stderr(error);
			}
		}, 1000, {label: $$.loadSelectedComponentMeta});

		load();
	}

	/**
	 * Loads selected component data
	 */
	loadSelectedComponentData(): CanPromise<void> {
		// Override
	}

}
