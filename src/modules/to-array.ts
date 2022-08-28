import type { G } from "../types/generator";

export default function toArray<T>(generator: G<T, unknown>): T[] {
	return Array.from(generator);
}
