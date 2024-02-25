export function zip() {
  return async function* <T extends AsyncGenerator<unknown, unknown, unknown>[] | []>(
    iterators: T,
  ): AsyncGenerator<{ -readonly [K in keyof T]: IteratorYield<T[K]> }, IteratorReturn<T[number]>, undefined> {
    try {
      while (true) {
        const results = await Promise.all(iterators.map((iterator) => iterator.next()));

        const doneResult = results.find((result) => result.done);
        if (doneResult) return doneResult.value as IteratorReturn<T[number]>;

        yield results.map((result) => result.value) as { -readonly [K in keyof T]: IteratorYield<T[K]> };
      }
    } finally {
      await Promise.all(iterators.map((iterator) => iterator.return?.(undefined)));
    }
  };
}
