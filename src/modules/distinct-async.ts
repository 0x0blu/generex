import type { AG } from "../types/generator";
import type { PromiseOr } from "../types/promise";
import filterAsync from "./filter-async";

export default async function* distinctAsync<T, TReturn>(
	generator: AG<T, TReturn>,
	compare = (a: T, b: T): PromiseOr<boolean> => a == b,
): AG<T, TReturn> {
	const next = await generator.next();

	if (next.done) return next.value;
	else yield next.value;

	let last: T;
	let current = next.value;

	return yield* filterAsync(generator, async next => {
		last = current;
		current = next;

		return !(await compare(last, current));
	});
}
