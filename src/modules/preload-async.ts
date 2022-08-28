import type { AG } from "../types/generator";
import type { PromiseOr } from "../types/promise";
import Queue from "../utils/queue";

export default async function* preloadAsync<T, TReturn>(generator: AG<T, TReturn>, depth = 1): AG<T, TReturn> {
	if (depth == 0) return yield* generator;

	const queue = new Queue<PromiseOr<IteratorResult<T, TReturn>>>();

	for (;;) {
		if (queue.length < depth) queue.push(generator.next());
		else {
			const next = await queue.pop()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
			if (next.done) return next.value;
			else yield next.value;
		}
	}
}
