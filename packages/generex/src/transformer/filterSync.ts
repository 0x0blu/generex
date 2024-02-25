export function filterSync<T>(predicate: (value: T) => boolean) {
  return function* <TReturn>(input: Iterator<T, TReturn>): Generator<T, TReturn, undefined> {
    try {
      while (true) {
        const result = input.next();
        if (result.done) return result.value;

        if (predicate(result.value)) yield result.value;
      }
    } finally {
      input.return?.();
    }
  };
}
