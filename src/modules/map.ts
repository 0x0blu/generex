import type { G } from "../types/generator";

export default function* map<T, TReturn, U>(
	generator: G<T, TReturn>,
	mapping: (value: T, index: number) => U,
): G<U, TReturn> {
	for (let index = 0; ; index++) {
		const next = generator.next();

		if (next.done) return next.value;
		else yield mapping(next.value, index);
	}
}
