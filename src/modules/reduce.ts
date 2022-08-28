import type { G } from "../types/generator";

export default function reduce<T, U>(
	generator: G<T, unknown>,
	reduce: (aggregate: U, value: T, index: number) => U,
	initialValue: U,
): U {
	let value = initialValue;

	for (let index = 0; ; index++) {
		const next = generator.next();

		if (next.done) return value;
		else value = reduce(value, next.value, index);
	}
}
