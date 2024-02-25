import { sleep } from '../utils/sleep.js';

export function sample(ms: number) {
  return async function* <T, TReturn>(input: AsyncIterator<T, TReturn>): AsyncGenerator<T, TReturn, undefined> {
    try {
      // Keep track of the next result promise and last yield time.
      let nextResultPromise: Promise<IteratorResult<T, TReturn>> | null = input.next();
      let lastYieldTime = 0;

      while (true) {
        const result = await (nextResultPromise ?? input.next());
        if (result.done) return result.value;

        // Calculate the time remaining for the next sample.
        const timeSinceLastYield = Date.now() - lastYieldTime;
        const timeToWait = ms - timeSinceLastYield;

        // If the time to wait is zero or negative, we can yield the result right away.
        if (timeToWait <= 0) {
          // Set the next result promise to null, so that we fetch a fresh one next time.
          nextResultPromise = null;

          // Yield the result and start over.
          lastYieldTime = Date.now();
          yield result.value;
          continue;
        }

        // Request the next result right away, and keep track of the promise for next iteration.
        nextResultPromise = input.next();

        // Wait for the next value for no more than the next sample time.
        const nextResult = await Promise.race([nextResultPromise, sleep(timeToWait)]);

        // If a result came before the sampling time, we still have time to fetch the next one to be sampled.
        if (nextResult) continue;

        // Else, just use the result we already have.
        lastYieldTime = Date.now();
        yield result.value;
      }
    } finally {
      await input.return?.();
    }
  };
}
