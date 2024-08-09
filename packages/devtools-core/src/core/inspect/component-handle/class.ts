/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */
import SyncPromise from 'core/promise/sync';
import { ComponentQuery, deserialize } from '@v4fire/devtools-backend';

// FIXME: This import confronts with the V4Fire restrictions @see https://github.com/V4Fire/Client/issues/1111
import type iBlock from 'components/super/i-block/i-block';
import type { ComponentElement } from 'core/component';

import DevtoolsHandle, { PageFunctionWithCtx, evaluateEngine } from 'core/inspect/devtools-handle';
import type { ComponentData } from 'features/components/b-components-panel/interface';

export default class ComponentHandle extends DevtoolsHandle<iBlock> {
	/**
	 * Component query
	 */
	private readonly query: ComponentQuery;

	/**
	 * Promise of component handle readiness
	 */
	private isReadyStore?: SyncPromise<void>;

	constructor(query: ComponentQuery) {
		const id = `component-${query.componentId}`;
		super(id);
		this.query = query;
	}

	/**
	 * Returns the component id
	 */
	get componentId(): string {
		return this.query.componentId;
	}

	/**
	 * Returns the component name
	 */
	get componentName(): string | undefined {
		return this.query.componentName;
	}

	override evaluate<T = unknown, Arg = unknown>(
		pageFunction: PageFunctionWithCtx<iBlock, T, Arg>,
		arg?: Arg | undefined
	): Promise<T> {
		return this.isReady.then(super.evaluate.bind(this, pageFunction, arg));
	}

	/**
	 * Highlights the component
	 * @param autoHide
	 */
	highlight(autoHide: boolean): void {
		this.evaluate((ctx, autoHide) => {
			const backend = globalThis.__V4FIRE_DEVTOOLS_BACKEND__;
			const node = backend.findComponentNode(ctx);
			// @ts-expect-error Non-standard API
			node?.scrollIntoViewIfNeeded(false);

			backend.componentHighlight.show(ctx);

			if (autoHide) {
				backend.componentHighlight.hide({delay: 1500, animate: true});
			}
		}, autoHide).catch(stderr);
	}

	/**
	 * Returns the data of the component
	 */
	async getData(): Promise<ComponentData | null> {
		const serializedData = await this.evaluate((ctx) => {
			const backend = globalThis.__V4FIRE_DEVTOOLS_BACKEND__;

			const restricted = new Set([
				'r',
				'self',
				'unsafe',
				'router',
				'LANG_PACKS'
			]);

			const node = backend.findComponentNode(ctx);

			if (node == null) {
				return null;
			}

			const {component} = <ComponentElement>node;

			if (component == null) {
				throw new Error("DOM node doesn't have component property");
			}

			const {componentName, props, fields, computedFields, systemFields, mods} = component.unsafe.meta;

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

			const result = {
				componentId: ctx.componentId,
				componentName,
				props,
				fields,
				computedFields,
				systemFields,
				mods,
				hierarchy,
				values
			};

			return backend.serialize(
				result,
				(key, value) => key.startsWith('$') || restricted.has(key) || value === globalThis || value === document || value === console
			);
		});

		return serializedData != null ? deserialize(serializedData) : null;
	}

	/**
	 * Sets a component modifier by the specified name
	 *
	 * @param name - the modifier name
	 * @param value - the modifier value
	 */
	setMod(name: string, value?: unknown): Promise<void> {
		return this.evaluate((ctx, {name, value}) => {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			ctx.setMod(name, value);
		}, {name, value});
	}

	/**
	 * Subscribes to component changes. The `callback` is triggered each time
	 * when something changes in the component
	 *
	 * @param _callback
	 */
	subscribe(_callback: () => void): () => void {
		return Object.throw();
	}

	/**
	 * Resolves when component handle is ready to be evaluated
	 */
	private get isReady(): Promise<void> {
		const {id, query} = this;

		if (this.isReadyStore == null) {
			const handleCreated = evaluateEngine(({id, query}) => {
				const backend = globalThis.__V4FIRE_DEVTOOLS_BACKEND__;
				const node = backend.findComponentNode<ComponentElement>(query);

				if (node?.component != null) {
					// FIXME: encapsulation of devtool-handle is violated
					backend.handles.set(id, node.component);

					node.component.unsafe.$once('hook:beforeDestroy', () => {
						backend.handles.delete(id);
					});
				}
			}, {id, query});

			this.isReadyStore = SyncPromise.resolve(handleCreated);
		}

		return this.isReadyStore;
	}
}

