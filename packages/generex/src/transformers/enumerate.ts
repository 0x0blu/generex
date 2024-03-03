export function enumerate() {
  return async function* <T, TReturn>(input: AnyIterator<T, TReturn>): AsyncGenerator<[number, T], TReturn, undefined> {
    try {
      let i = 0;

      while (true) {
        const result = await input.next();
        if (result.done) return result.value;

        yield [i++, result.value];
      }
    } finally {
      await input.return?.();
    }
  };
}
