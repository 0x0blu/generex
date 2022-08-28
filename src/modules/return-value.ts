import type { G } from "../types/generator";

export default function returnValue<TReturn>(generator: G<unknown, TReturn>): TReturn {
	let next: IteratorResult<unknown, TReturn>;

	do next = generator.next();
	while (!next.done);

	return next.value;
}
