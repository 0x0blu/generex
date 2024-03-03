import { sleep } from '../utils/sleep.js';

export function throttle(ms: number) {
  return async function* <T, TReturn>(input: AnyIterator<T, TReturn>): AsyncGenerator<T, TReturn, undefined> {
    try {
      let lastYieldTime = 0;

      while (true) {
        const result = await input.next();
        if (result.done) return result.value;

        const timeSinceLastYield = Date.now() - lastYieldTime;
        const timeToWait = ms - timeSinceLastYield;

        if (timeToWait > 0) await sleep(timeToWait);

        lastYieldTime = Date.now();
        yield result.value;
      }
    } finally {
      await input.return?.();
    }
  };
}
