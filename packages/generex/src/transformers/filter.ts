export function filter<T>(predicate: (value: T) => PromiseOr<boolean>) {
  return async function* <TReturn>(input: AnyIterator<T, TReturn>): AsyncGenerator<T, TReturn, undefined> {
    try {
      while (true) {
        const result = await input.next();
        if (result.done) return result.value;

        if (await predicate(result.value)) yield result.value;
      }
    } finally {
      await input.return?.();
    }
  };
}
