import { Deque } from '../utils/Deque.js';

type DetachFn<T, TReturn> = (callback: (value: T) => void) => PromiseOr<TReturn>;

export function injectable<T, TReturn = unknown>(detach: DetachFn<T, TReturn>) {
  return new Injectable(detach);
}

class Injectable<T, TReturn> implements AsyncGenerator<T, TReturn, undefined> {
  #generator: AsyncGenerator<T, TReturn, undefined>;
  #queue: Deque<IteratorResult<T, TReturn>> = new Deque();
  #detached = false;
  #detach: DetachFn<T, TReturn>;

  constructor(detach: DetachFn<T, TReturn>) {
    this.#detach = detach;
    this.#generator = async function* (this: Injectable<T, TReturn>) {
      try {
        while (true) {
          const result = await this.#queue.popStartAsync();
          if (result.done) return result.value;

          yield result.value;
        }
      } finally {
        if (!this.#detached) return await detach(this.inject.bind(this));
      }
    }.bind(this)();
  }

  inject(value: T) {
    if (this.#detached) return;
    this.#queue.pushEnd({ value, done: false });
  }

  async detach() {
    if (this.#detached) return;
    this.#detached = true;

    const returnValue = await this.#detach(this.inject.bind(this));
    this.#queue.pushEnd({ value: returnValue, done: true });
  }

  next(): Promise<IteratorResult<T, TReturn>> {
    return this.#generator.next();
  }

  return(value: TReturn | PromiseLike<TReturn>): Promise<IteratorResult<T, TReturn>> {
    return this.#generator.return(value);
  }

  throw(error: unknown): Promise<IteratorResult<T, TReturn>> {
    return this.#generator.throw(error);
  }

  [Symbol.asyncIterator](): AsyncGenerator<T, TReturn, undefined> {
    return this.#generator[Symbol.asyncIterator]();
  }
}
