/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

import iBlock, { component, prop, computed } from 'components/super/i-block/i-block';
import type { ComponentsTreeState } from 'features/components/b-components-tree/b-components-tree';

import type { NamePart } from 'features/components/b-components-tree/modules/b-components-tree-item/interface';

@component()
export default class bComponentsTreeItem extends iBlock {
	/**
	 * Item's label
	 */
	@prop({type: String, required: true})
	label!: string;

	/**
	 * Item's value
	 */
	@prop({type: String, required: true})
	value!: string;

	/**
	 * Render count of a given component
	 */
	@prop({type: Number, required: true})
	renderCounterProp!: number;

	/**
	 * Is `true` for a functional component
	 */
	@prop({type: Boolean, required: true})
	isFunctionalProp!: boolean;

	/**
	 * Always shows component's details highlighted as warning
	 */
	@prop({type: Boolean, required: true})
	showWarning!: boolean;

	/**
	 * State of the components tree
	 */
	@prop(Object)
	treeState!: ComponentsTreeState;

	/**
	 * Returns `true` if item is current search match
	 */
	@computed({dependencies: ['value', 'treeState.currentSearchIndex']})
	get isCurrentSearchMatch(): boolean {
		return this.treeState.searchMatches[this.treeState.currentSearchIndex] === this.value;
	}

	/**
	 * Returns name of the component with the highlighted parts matching
	 * the search query
	 */
	@computed({dependencies: ['label', 'treeState.searchMatchesIndices']})
	get name(): NamePart[] {
		const {searchMatchesIndices} = this.treeState;
		const indices = searchMatchesIndices.get(this.value);

		if (indices == null) {
			return [{text: this.label}];
		}

		const [startIndex, stopIndex] = indices;

		const parts: NamePart[] = [];
		if (startIndex > 0) {
			parts.push({text: this.label.slice(0, startIndex)});
		}

		parts.push({text: this.label.slice(startIndex, stopIndex), highlight: true});

		if (stopIndex < this.label.length) {
			parts.push({text: this.label.slice(stopIndex)});
		}

		return parts;
	}
}
