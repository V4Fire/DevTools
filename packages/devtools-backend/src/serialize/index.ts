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
 * Serializes a value
 * @param value
 */
export function serialize<T = unknown>(value: T): string {
	return JSON.stringify(value, expandedStringify);
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

function expandedStringify(_: string, value: unknown): unknown {
	const type = typeRgxp.exec({}.toString.call(value))![1];

	switch (type) {
		case 'Date':
			return serializeComplexData(type, (<Date>value).valueOf());

		case 'BigInt':
		case 'Function':
			return serializeComplexData(type, (<{toString(): string}>value).toString());

		case 'Map':
		case 'Set':
			return serializeComplexData(type, [...(<Iterable<any>>value)]);
		default:
			return value;
	}
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
