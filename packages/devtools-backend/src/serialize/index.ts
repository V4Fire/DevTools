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
	isRestrictedKey?: (key: string) => boolean
): string {
	return JSON.stringify(value, expandedStringify);

	function expandedStringify(key: string, value: unknown): unknown {
		if (isRestrictedKey?.(key)) {
			return '*restricted*';
		}

		const type = getType(value);
		switch (type) {
			case 'Date':
				return serializeComplexData(type, (<Date>value).valueOf());

			case 'BigInt':
			case 'Function':
				return serializeComplexData(type, (<{toString(): string}>value).toString());

			case 'Map':
			case 'Set':
				return serializeComplexData(type, [...(<Iterable<any>>value)]);

			case 'Array':
				return value;

			default:
				// Do not serialize non-plain objects, instead return constructor name
				if (typeof value === 'object' && value?.constructor !== Object) {
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					return value?.constructor?.name ?? value;
				}

				return value;
		}
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
