import type { G } from "../types/generator";

export default function* filter<T, TReturn>(
	generator: G<T, TReturn>,
	predicate: (value: T, index: number) => boolean,
): G<T, TReturn> {
	for (let index = 0; ; index++) {
		const next = generator.next();

		if (next.done) return next.value;
		else if (predicate(next.value, index)) yield next.value;
	}
}
