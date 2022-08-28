import type { AG } from "../types/generator";
import type { PromiseOr } from "../types/promise";

export default async function reduceAsync<T, U>(
	generator: AG<T, unknown>,
	reduce: (aggregate: U, value: T, index: number) => PromiseOr<U>,
	initialValue: U,
): Promise<U> {
	let value = initialValue;

	for (let index = 0; ; index++) {
		const next = await generator.next();

		if (next.done) return value;
		else value = await reduce(value, next.value, index);
	}
}
