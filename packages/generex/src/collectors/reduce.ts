export function reduce<T, U>(
  input: AnyIterator<T>,
  reducer: (accumulator: U, value: T, index: number) => PromiseOr<U>,
  initialValue: U,
): Promise<U>;

export function reduce<T>(
  input: AnyIterator<T>,
  reducer: (accumulator: T, value: T, index: number) => PromiseOr<T>,
): Promise<T | undefined>;

export async function reduce<T, U>(
  input: AnyIterator<T>,
  reducer: (accumulator: U | T, value: T, index: number) => PromiseOr<U>,
  initialValue?: U,
): Promise<U | T | undefined> {
  const result = await input.next();
  if (result.done) return initialValue;

  let accumulator = initialValue !== undefined ? await reducer(initialValue, result.value, 0) : result.value;

  let index = 1;

  while (true) {
    const result = await input.next();
    if (result.done) return accumulator;

    accumulator = await reducer(accumulator, result.value, index++);
  }
}
