type QueueNode<T> = [value: T, next: QueueNode<T> | undefined];

export default class Queue<T> {
	#pointers: [start: QueueNode<T>, end: QueueNode<T>] | undefined;
	#length = 0;

	push(value: T): void {
		const node: QueueNode<T> = [value, this.#pointers?.[0]];
		this.#length += 1;

		if (this.#pointers) this.#pointers[0] = node;
		else this.#pointers = [node, node];
	}

	pop(): T | undefined {
		if (!this.#pointers) return;

		const [result, next] = this.#pointers[0];
		this.#length -= 1;

		if (next) this.#pointers[0] = next;
		else this.#pointers = undefined;

		return result;
	}

	get length(): number {
		return this.#length;
	}
}
