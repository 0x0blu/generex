import type { AG } from "../types/generator";

export default async function returnValueAsync<TReturn>(generator: AG<unknown, TReturn>): Promise<TReturn> {
	let next: IteratorResult<unknown, TReturn>;

	do next = await generator.next();
	while (!next.done);

	return next.value;
}
