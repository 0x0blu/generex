export function deduplicate<T>(equals: (a: T, b: T) => PromiseOr<boolean> = (a, b) => a === b) {
  return async function* <TReturn>(input: AnyIterator<T, TReturn>): AsyncGenerator<T, TReturn, undefined> {
    try {
      const result = await input.next();
      if (result.done) return result.value;

      let last = result.value;
      yield result.value;

      while (true) {
        const result = await input.next();
        if (result.done) return result.value;

        if (await equals(last, result.value)) continue;

        last = result.value;
        yield result.value;
      }
    } finally {
      await input.return?.();
    }
  };
}
