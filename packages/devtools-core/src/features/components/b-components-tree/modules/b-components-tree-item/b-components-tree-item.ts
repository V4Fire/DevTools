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
	@prop({type: String, required: true})
	label!: string;

	@prop({type: String, required: true})
	value!: string;

	@prop({type: Number, required: true})
	renderCounterProp!: number;

	@prop({type: Boolean, required: true})
	isFunctionalProp!: number;

	@prop({type: Boolean, required: true})
	showWarning!: boolean;

	@prop(Object)
	treeState!: ComponentsTreeState;

	@computed({dependencies: ['value', 'treeState.active']})
	get selected(): boolean {
		return this.treeState.active === this.value;
	}

	@computed({dependencies: ['label', 'treeState.searchQuery']})
	get name(): NamePart[] {
		const {searchQuery} = this.treeState;
		if (searchQuery == null) {
			return [{text: this.label}];
		}

		let
			startIndex = -1,
			stopIndex = -1;

		if (Object.isString(searchQuery)) {
			startIndex = this.label.indexOf(searchQuery);
			stopIndex = startIndex + searchQuery.length;

		} else {
			const match = searchQuery.exec(this.label);

			if (match != null) {
				startIndex = match.index;
				stopIndex = startIndex + match[0].length;
			}
		}

		if (startIndex === -1) {
			return [{text: this.label}];
		}

		if (this.treeState.searchMatches.length === 0) {
			this.treeState.gotoItem(this.value);
		}

		this.treeState.searchMatches.push(this.value);

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
