import type { AG, AGYield } from "../types/generator";
import mapAsync from "./map-async";

export default async function* zipAsync<T extends AG<unknown, unknown>[]>(
	...generators: T
): AG<{ [P in keyof T]: AGYield<T[P]> }, void> {
	if (generators.length == 0) return;

	if (generators.length == 1) yield* mapAsync(generators[0], v => [v]) as AG<{ [P in keyof T]: AGYield<T[P]> }, void>;

	for (;;) {
		const entry = [] as { [P in keyof T]: AGYield<T[P]> };

		for (const generator of generators) {
			const next = await generator.next();
			if (next.done) return;

			entry.push(next.value);
		}

		yield entry;
	}
}
