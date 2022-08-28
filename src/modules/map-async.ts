import type { AG } from "../types/generator";
import type { PromiseOr } from "../types/promise";

export default async function* mapAsync<T, TReturn, U>(
	generator: AG<T, TReturn>,
	mapping: (value: T, index: number) => PromiseOr<U>,
): AG<U, TReturn> {
	for (let index = 0; ; index++) {
		const next = await generator.next();

		if (next.done) return next.value;
		else yield await mapping(next.value, index);
	}
}
