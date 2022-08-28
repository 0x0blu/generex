import type { AG } from "../types/generator";

const neverFulfillingPromise = new Promise<never>(() => null);

export default function mergeAsync<T, TReturn>(...generators: AG<T, TReturn>[]): AG<T, TReturn[]> {
	let remaining = generators.length;

	const results: TReturn[] = Array(generators.length);

	const promises = generators.map(async function get(generator, index): Promise<() => IteratorResult<T, TReturn[]>> {
		const result = await generator.next();

		if (result.done) {
			remaining -= 1;

			if (remaining) return neverFulfillingPromise;

			return () => ({ done: true, value: results });
		}

		return () => {
			promises[index] = get(generator, index);
			return result;
		};
	});

	async function next(): Promise<IteratorResult<T, TReturn[]>> {
		if (remaining == 0) return { done: true, value: results };
		return (await Promise.race(promises))();
	}

	return (async function* () {
		for (;;) {
			const result = await next();
			if (result.done) return result.value;
			yield result.value;
		}
	})();
}
