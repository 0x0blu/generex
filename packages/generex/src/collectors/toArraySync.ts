export function toArraySync<T>(input: Iterator<T>): T[] {
  const values: T[] = [];

  while (true) {
    const result = input.next();
    if (result.done) return values;

    values.push(result.value);
  }
}
