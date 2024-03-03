export function map<T1, T2>(mapping: (value: T1) => PromiseOr<T2>) {
  return async function* <TReturn>(input: AnyIterator<T1, TReturn>): AsyncGenerator<T2, TReturn, undefined> {
    try {
      while (true) {
        const result = await input.next();
        if (result.done) return result.value;

        yield await mapping(result.value);
      }
    } finally {
      await input.return?.();
    }
  };
}
