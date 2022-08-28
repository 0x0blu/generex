import type { G, GYield } from "../types/generator";
import map from "./map";

export default function* zip<T extends G<unknown, unknown>[]>(
	...generators: T
): G<{ [P in keyof T]: GYield<T[P]> }, void> {
	if (generators.length == 0) return;

	if (generators.length == 1) yield* map(generators[0], v => [v]) as G<{ [P in keyof T]: GYield<T[P]> }, void>;

	for (;;) {
		const entry = [] as { [P in keyof T]: GYield<T[P]> };

		for (const generator of generators) {
			const next = generator.next();
			if (next.done) return;

			entry.push(next.value);
		}

		yield entry;
	}
}
