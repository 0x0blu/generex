export function enumerateSync() {
  return function* <T, TReturn>(input: Iterator<T, TReturn>): Generator<[number, T], TReturn, undefined> {
    try {
      let i = 0;

      while (true) {
        const result = input.next();
        if (result.done) return result.value;

        yield [i++, result.value];
      }
    } finally {
      input.return?.();
    }
  };
}
