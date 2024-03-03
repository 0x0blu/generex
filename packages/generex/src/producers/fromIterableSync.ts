export function* fromIterableSync<T>(iterable: Iterable<T>): Generator<T, undefined, undefined> {
  yield* iterable;
}
