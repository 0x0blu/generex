import type { AG } from "../types/generator";
import type { PromiseOr } from "../types/promise";

export default async function* filterAsync<T, TReturn>(
	generator: AG<T, TReturn>,
	predicate: (value: T, index: number) => PromiseOr<boolean>,
): AG<T, TReturn> {
	for (let index = 0; ; index++) {
		const next = await generator.next();

		if (next.done) return next.value;
		else if (await predicate(next.value, index)) yield next.value;
	}
}
