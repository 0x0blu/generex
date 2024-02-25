export class Deque<T> {
  #list: T[] = [];
  #start = 0;
  #size = 0;

  #pushListeners: ((value: T) => void)[] = [];
  #popListeners: ((value: T) => void)[] = [];

  pushStart(value: T) {
    this.#incremenetSize();
    this.#start = (this.#start - 1 + this.#list.length) % this.#list.length;
    this.#list[this.#start] = value;
    this.#onPush(value);
  }

  pushEnd(value: T) {
    this.#incremenetSize();
    const index = (this.#start + this.#size - 1) % this.#list.length;
    this.#list[index] = value;
    this.#onPush(value);
  }

  popStart(): T | undefined {
    const value = this.#list[this.#start];
    this.#start = (this.#start + 1) % this.#list.length;
    this.#decremenetSize();
    this.#onPop(value);
    return value;
  }

  popEnd(): T | undefined {
    const index = (this.#start + this.#size - 1) % this.#list.length;
    const value = this.#list[index];
    this.#decremenetSize();
    this.#onPop(value);
    return value;
  }

  waitForPush() {
    const promise = new Promise<T>((fulfill) => {
      this.#pushListeners.push(fulfill);
    });

    return promise;
  }

  waitForPop() {
    const promise = new Promise<T>((fulfill) => {
      this.#popListeners.push(fulfill);
    });

    return promise;
  }

  get size() {
    return this.#size;
  }

  #incremenetSize() {
    const newSize = this.#size + 1;
    if (newSize > this.#list.length) this.#doubleCapacity();
    this.#size++;
  }

  #decremenetSize() {
    const newSize = this.#size - 1;
    if (newSize < 0) return;
    if (newSize < this.#list.length / 4) this.#halveCapacity();
    this.#size--;
  }

  #doubleCapacity() {
    const newCapacity = this.#list.length ? this.#list.length * 2 : 8;
    const nextList = new Array(newCapacity).fill(null);

    for (let i = 0; i < this.#size; i++) {
      const index = (this.#start + i) % this.#list.length;
      nextList[i] = this.#list[index];
    }

    this.#list = nextList;
    this.#start = 0;
  }

  #halveCapacity() {
    const newCapacity = Math.max(this.#list.length / 2, 8);
    if (this.#list.length === newCapacity) return;

    const nextList = new Array(newCapacity).fill(null);

    for (let i = 0; i < this.#size; i++) {
      const index = (this.#start + i) % this.#list.length;
      nextList[i] = this.#list[index];
    }

    this.#list = nextList;
    this.#start = 0;
  }

  #onPush(value: T) {
    if (!this.#pushListeners.length) return;
    for (const listener of this.#pushListeners) listener(value);
    this.#pushListeners = [];
  }

  #onPop(value: T) {
    if (!this.#popListeners.length) return;
    for (const listener of this.#popListeners) listener(value);
    this.#popListeners = [];
  }
}
