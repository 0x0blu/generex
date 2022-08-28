import type { AG } from "../types/generator";

export default async function toArrayWithReturnValueAsync<T, TReturn>(
	generator: AG<T, TReturn>,
): Promise<[T[], TReturn]> {
	const array: T[] = [];

	for (;;) {
		const next = await generator.next();

		if (next.done) return [array, next.value];
		else array.push(next.value);
	}
}
