import type { G } from "../types/generator";

export default function toArrayWithReturnValue<T, TReturn>(generator: G<T, TReturn>): [T[], TReturn] {
	const array: T[] = [];

	for (;;) {
		const next = generator.next();

		if (next.done) return [array, next.value];
		else array.push(next.value);
	}
}
