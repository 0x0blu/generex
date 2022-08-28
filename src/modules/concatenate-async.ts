import type { AG } from "../types/generator";

export default async function* concatenateAsync<T, TReturn>(...generators: AG<T, TReturn>[]): AG<T, TReturn[]> {
	const returnValues: TReturn[] = [];

	for (const generator of generators) returnValues.push(yield* generator);

	return returnValues;
}
