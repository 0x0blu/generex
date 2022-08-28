import type { G } from "../types/generator";

export default function* concatenate<T, TReturn>(...generators: G<T, TReturn>[]): G<T, TReturn[]> {
	const returnValues: TReturn[] = [];

	for (const generator of generators) returnValues.push(yield* generator);

	return returnValues;
}
