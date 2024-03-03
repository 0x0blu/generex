export function mapSync<T1, T2>(mapping: (value: T1) => T2) {
  return function* <TReturn>(input: Iterator<T1, TReturn>): Generator<T2, TReturn, undefined> {
    try {
      while (true) {
        const result = input.next();
        if (result.done) return result.value;

        yield mapping(result.value);
      }
    } finally {
      input.return?.();
    }
  };
}
