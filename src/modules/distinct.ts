import type { G } from "../types/generator";
import filter from "./filter";

export default function* distinct<T, TReturn>(
	generator: G<T, TReturn>,
	compare = (a: T, b: T) => a == b,
): G<T, TReturn> {
	const next = generator.next();

	if (next.done) return next.value;
	else yield next.value;

	let last: T;
	let current = next.value;

	return yield* filter(generator, next => {
		last = current;
		current = next;

		return !compare(last, current);
	});
}
