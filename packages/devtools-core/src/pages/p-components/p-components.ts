/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import symbolGenerator from 'core/symbol';
import iDynamicPage, { component, field, computed, watch } from 'components/super/i-dynamic-page/i-dynamic-page';

import type bTree from '@v4fire/client/components/base/b-tree/b-tree';
import type { Item } from 'components/base/b-tree/b-tree';
import type { ComponentData } from 'features/components/b-components-panel';

export * from 'components/super/i-dynamic-page/i-dynamic-page';

const $$ = symbolGenerator();

@component()
export default class pComponents extends iDynamicPage {
	override readonly $refs!: iDynamicPage['$refs'] & {
		tree?: bTree;
		panel?: bTree;
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
	 * Selected component's name
	 */
	@computed()
	get selectedComponentName(): string | null {
		return <string>this.$refs.tree?.getItemByValue(this.selectedComponentId)?.componentName;
	}

	/**
	 * Handle component select
	 *
	 * @param _
	 * @param componentId
	 */
	@watch('?$refs.tree:change')
	onComponentSelect(_: unknown, componentId: string): void {
		this.selectedComponentId = componentId;
		this.selectedComponentData = null;

		const load = this.async.debounce(async () => {
			try {
				await this.loadSelectedComponentData();
			} catch (error) {
				// TODO: show alert
				stderr(error);
			}
		}, 300, {label: $$.loadSelectedComponentMeta});

		load();
	}

	/**
	 * Loads selected component data
	 */
	loadSelectedComponentData(): CanPromise<void> {
		// Override
	}

}
