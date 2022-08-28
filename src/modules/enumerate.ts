import type { G } from "../types/generator";
import map from "./map";

export default function enumerate<T, TReturn>(generator: G<T, TReturn>): G<[number, T], TReturn> {
	return map(generator, (value, index) => [index, value]);
}
