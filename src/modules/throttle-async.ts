import type { AG } from "../types/generator";
import sleep from "../utils/sleep";

export default async function* throttleAsync<T, TReturn>(generator: AG<T, TReturn>, ms: number): AG<T, TReturn> {
	let throttledUntil = 0;

	for (;;) {
		const next = await generator.next();

		if (next.done) return next.value;
		else {
			const now = Date.now();
			if (throttledUntil > now) await sleep(throttledUntil - now);

			yield next.value;

			throttledUntil = Date.now() + ms;
		}
	}
}
