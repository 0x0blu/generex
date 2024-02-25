import { Deque } from '../utils/Deque.js';

export function preload(count: number) {
  if (count < 1) {
    throw new Error('count must be greater than or equal to 1');
  }

  return async function* <T, TReturn>(input: AsyncIterator<T, TReturn>): AsyncGenerator<T, TReturn, undefined> {
    try {
      const queue = new Deque<IteratorResult<T, TReturn>>();

      (async () => {
        while (true) {
          if (queue.size == count) await queue.waitForPop();

          const result = await input.next();
          queue.pushEnd(result);

          if (result.done) break;
        }
      })();

      while (true) {
        const result = queue.popStart() ?? (await queue.waitForPush());
        if (result.done) return result.value;

        yield result.value;
      }
    } finally {
      await input.return?.();
    }
  };
}
