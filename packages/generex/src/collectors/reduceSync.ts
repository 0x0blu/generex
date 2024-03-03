export function reduceSync<T, U>(
  input: Iterator<T>,
  reducer: (accumulator: U, value: T, index: number) => U,
  initialValue: U,
): U;

export function reduceSync<T>(
  input: Iterator<T>,
  reducer: (accumulator: T, value: T, index: number) => T,
): T | undefined;

export function reduceSync<T, U>(
  input: Iterator<T>,
  reducer: (accumulator: U | T, value: T, index: number) => U,
  initialValue?: U,
): U | T | undefined {
  const result = input.next();
  if (result.done) return initialValue;

  let accumulator = initialValue !== undefined ? reducer(initialValue, result.value, 0) : result.value;

  let index = 1;

  while (true) {
    const result = input.next();
    if (result.done) return accumulator;

    accumulator = reducer(accumulator, result.value, index++);
  }
}
