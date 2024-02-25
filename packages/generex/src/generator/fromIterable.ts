export async function* fromIterable<T>(iterable: AnyIterable<T>): AsyncGenerator<T, undefined, undefined> {
  yield* iterable;
}
