import type { AG } from "../types/generator";

export default async function toArrayAsync<T, TReturn>(generator: AG<T, TReturn>): Promise<T[]> {
	const array: T[] = [];

	for (;;) {
		const next = await generator.next();

		if (next.done) return array;
		else array.push(next.value);
	}
}
