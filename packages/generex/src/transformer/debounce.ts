import { sleep } from '../utils/sleep.js';

export function debounce(ms: number) {
  return async function* <T, TReturn>(input: AsyncIterator<T, TReturn>): AsyncGenerator<T, TReturn, undefined> {
    try {
      // Keep track of the next result promise.
      let nextResultPromise = input.next();

      while (true) {
        const result = await nextResultPromise;
        if (result.done) return result.value;

        // Request the next result right away, and keep track of the promise for next iteration.
        nextResultPromise = input.next();

        // Wait for the next value for no more than the debounce window.
        const nextResult = await Promise.race([nextResultPromise, sleep(ms)]);

        // If a result came before the debounce window closed, we need to start the debounce window over.
        if (nextResult) continue;

        // Else, the debounce window has closed, and we can yield the result.
        yield result.value;
      }
    } finally {
      await input.return?.();
    }
  };
}
