/*!
 * V4Fire DevTools
 * https://github.com/V4Fire/DevTools
 *
 * Released under the MIT license
 * https://github.com/V4Fire/DevTools/blob/main/LICENSE
 */

type SerializedData = {[K in `__DATA__:${string}`]: unknown;} & {__DATA__: `__DATA__:${string}`};

const
	typeRgxp = /^\[object (.*)]$/;

// TODO: create container type for serialized value

/**
 * Returns type of the value
 *
 * @param value
 *
 * @example
 * ```
 * getType(() => {}) // 'Function'
 * getType({}) // 'Object'
 * getType([]) // 'Array'
 * ```
 */
export function getType<T = unknown>(value: T): string {
	return typeRgxp.exec({}.toString.call(value))![1];
}

/**
 * Serializes a value
 *
 * @param value
 * @param [isRestrictedKey]
 */
export function serialize<T = unknown>(
	value: T,
	isRestrictedKey?: (key: string, value?: unknown) => boolean
): string {
	let refCounter = 1;

	const
		visited = new WeakSet(),
		circularRefs = new WeakMap<object, number>(),
		childToParent = new WeakMap<object, object>();

	return JSON.stringify(value, expandedStringify);

	function expandedStringify(this: any, key: string, value: unknown): unknown {
		if (isRestrictedKey?.(key, value)) {
			return '[Restricted]';
		}

		if (this === value) {
			if (!circularRefs.has(this)) {
				circularRefs.set(this, refCounter++);
			}

			return `[Circular *${circularRefs.get(this)}]`;
		}

		const type = getType(value);
		switch (type) {
			case 'Date':
				return serializeComplexData(type, (<Date>value).valueOf());

			case 'BigInt':
			case 'Function':
				return serializeComplexData(type, (<{toString(): string}>value).toString());

			case 'Map':
			case 'Set': {
				const raw = [...(<Iterable<any>>value)];
				setParent(raw, this);
				return serializeComplexData(type, raw);
			}

			default: {
				const isObject = typeof value === 'object' && value != null;

				if (isObject) {
					// Do not serialize non-plain objects, instead return constructor name
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (value.constructor != null && value.constructor !== Object && type !== 'Array') {
						return value.constructor.name;
					}

					setParent(value, this);

					if (visited.has(value)) {
						const refId = getCircularRef(value);

						if (refId > 0) {
							return `[Circular *${refId}]`;
						}
					}

					visited.add(value);
				}

				return value;
			}
		}
	}

	function setParent(child: object, parent: object) {
		if (child !== parent) {
			childToParent.set(child, parent);
		}
	}

	function getCircularRef(obj: object): number {
		let parent = childToParent.get(obj);
		let i = 0;

		while (parent != null) {
			i++;

			// FIXME: there is issue with infinite loops, it may be related to objects wrapped in proxies
			if (i > 100) {
				return Infinity;
			}

			if (parent === obj) {
				let refId = circularRefs.get(obj);

				if (refId == null) {
					refId = refCounter++;
					circularRefs.set(obj, refId);
				}

				return refId;
			}

			parent = childToParent.get(parent);
		}

		return 0;
	}
}

/**
 * Deserializes a value
 * @param value
 */
export function deserialize<T = unknown>(value: string): T {
	return JSON.parse(value, expandedParse);
}

function serializeComplexData(type: string, value: unknown): SerializedData {
	return {
		__DATA__: `__DATA__:${type}`,
		[`__DATA__:${type}`]: value
	};
}

function isSerializedData(value: unknown): value is SerializedData {
	return (value != null && typeof value === 'object' && '__DATA__' in value);
}

function expandedParse(key: string, value: unknown | SerializedData): unknown {
	if (isSerializedData(value)) {
		return value[value.__DATA__];
	}

	if (key.startsWith('__DATA__:')) {
		const unsafeValue = <any>value;

		switch (key.split(':')[1]) {
			case 'Date': return new Date(unsafeValue);
			case 'BigInt': return BigInt(unsafeValue);
			case 'Function': return {toString: () => 'Function', declaration: unsafeValue};
			case 'Map': return new Map(unsafeValue);
			case 'Set': return new Set(unsafeValue);
			default: return value;
		}
	}

	return value;
}
