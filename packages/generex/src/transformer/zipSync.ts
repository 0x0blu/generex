export function zipSync() {
  return function* <T extends Generator<unknown, unknown, unknown>[] | []>(
    iterators: T,
  ): Generator<{ -readonly [K in keyof T]: IteratorYield<T[K]> }, IteratorReturn<T[number]>, undefined> {
    try {
      while (true) {
        const results = iterators.map((iterator) => iterator.next());

        const doneResult = results.find((result) => result.done);
        if (doneResult) return doneResult.value as IteratorReturn<T[number]>;

        yield results.map((result) => result.value) as { -readonly [K in keyof T]: IteratorYield<T[K]> };
      }
    } finally {
      iterators.map((iterator) => iterator.return?.(undefined));
    }
  };
}
