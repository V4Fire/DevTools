/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
import type { ComponentInterface } from 'core/component';
import type { VNode } from 'core/component/engines';

import Search from 'components/traits/i-search/search';
import type iSearch from 'components/traits/i-search/i-search';

const cache = new WeakMap<ComponentInterface, iSearch>();

/**
 * Returns closest parent component with `iSearch` trait
 *
 * @param vnode
 * @throws {Error} - if `iSearch` is not found
 */
export default function closestSearchTrait(vnode: VNode): iSearch {
	const ctx = vnode.virtualContext;

	if (ctx == null) {
		throw new Error('Can\'t get parent component');
	}

	if (cache.has(ctx)) {
		return cache.get(ctx)!;
	}

	let parent = ctx.$parent;

	while (parent != null) {
		if (isSearchTrait(parent)) {
			cache.set(ctx, parent);
			return parent;
		}

		parent = parent.$parent;
	}

	throw new Error('Parent component with iSearch trait not found');

}

function isSearchTrait(component: ComponentInterface): component is iSearch {
	return (<iSearch>component).search instanceof Search;
}
