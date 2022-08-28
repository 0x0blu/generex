import type { G } from "../types/generator";

export default function* fromIterable<T>(iterable: Iterable<T>): G<T, void> {
	for (const entry of iterable) yield entry;
}
