import type { G } from "../types/generator";

export default function* fromIterableWithReturnValue<T, TReturn>(
	iterable: Iterable<T>,
	returnValue: TReturn,
): G<T, TReturn> {
	for (const entry of iterable) yield entry;

	return returnValue;
}
