export async function toArray<T>(input: AnyIterator<T>): Promise<T[]> {
  const values: T[] = [];

  while (true) {
    const result = await input.next();
    if (result.done) return values;

    values.push(result.value);
  }
}
