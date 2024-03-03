export function deduplicateSync<T>(equals: (a: T, b: T) => boolean = (a, b) => a === b) {
  return function* <TReturn>(input: Iterator<T, TReturn>): Generator<T, TReturn, undefined> {
    try {
      const result = input.next();
      if (result.done) return result.value;

      let last = result.value;
      yield result.value;

      while (true) {
        const result = input.next();
        if (result.done) return result.value;

        if (equals(last, result.value)) continue;

        last = result.value;
        yield result.value;
      }
    } finally {
      input.return?.();
    }
  };
}
