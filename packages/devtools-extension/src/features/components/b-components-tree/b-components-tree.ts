/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import type { ComponentQuery } from '@v4fire/devtools-backend';
import { devtoolsEval } from 'core/browser-api';

import { component, hook, system } from 'components/super/i-block/i-block';

import Super, { Item } from '@super/features/components/b-components-tree/b-components-tree';

export * from '@super/features/components/b-components-tree/b-components-tree';

@component()
export default class bComponentsTree extends Super {

	/**
	 * Id of highlighted component
	 */
	@system()
	highlightedComponentId: string | null = null;

	@hook('mounted')
	init(): void {
		this.async.on(this.selfEmitter, 'change', (_: unknown, componentId: string) => {
			const item = <CanUndef<Item>>this.$refs.tree?.getItemByValue(componentId);

			if (item != null) {
				devtoolsEval(
					evalHighlightActive,
					[this.highlightedComponentId !== componentId, {componentId, componentName: item.componentName}]
				)
					.catch(stderr);
			}
		});
	}

	/**
	 * Show highlight for the component on mouseenter
	 *
	 * @param item
	 */
	protected override onItemMouseEnter(item: Item): void {
		this.highlightedComponentId = item.value;
		devtoolsEval(evalShowComponentHighlight, [{componentId: item.value, componentName: item.componentName}]).catch(stderr);
	}

	/**
	 * Hide highlight for the component
	 */
	protected override onItemMouseLeave(): void {
		devtoolsEval(evalHideComponentHighlight).catch(stderr);
	}
}

function evalHighlightActive(autoHide: boolean, query: ComponentQuery): void {
	const backend = globalThis.__V4FIRE_DEVTOOLS_BACKEND__;
	const node = backend.findComponentNode(query);
	// @ts-expect-error Non-standard API
	node?.scrollIntoViewIfNeeded(false);

	backend.componentHighlight.show(query);

	if (autoHide) {
		backend.componentHighlight.hide({delay: 1500, animate: true});
	}
}

function evalShowComponentHighlight(query: ComponentQuery): void {
	globalThis.__V4FIRE_DEVTOOLS_BACKEND__.componentHighlight.show(query);
}

function evalHideComponentHighlight(): void {
	globalThis.__V4FIRE_DEVTOOLS_BACKEND__.componentHighlight.hide();
}
