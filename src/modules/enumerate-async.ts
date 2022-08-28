import type { AG } from "../types/generator";
import mapAsync from "./map-async";

export default function enumerateAsync<T, TReturn>(generator: AG<T, TReturn>): AG<[number, T], TReturn> {
	return mapAsync(generator, (value, index) => [index, value]);
}
