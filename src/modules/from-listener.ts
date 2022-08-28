import type { AG } from "../types/generator";
import Queue from "../utils/queue";

export default function fromListener<T>(): {
	consumer: () => AG<T, void>;
	listener: (value: T) => void;
	disconnect: () => void;
} {
	const queue = new Queue<T>();
	let done = false;
	let resume: () => void = () => undefined;

	async function* consumer() {
		for (;;) {
			while (queue.length) yield queue.pop()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

			if (done) return;

			await new Promise<void>(fulfill => (resume = fulfill));
		}
	}

	function listener(value: T) {
		if (done) return;

		queue.push(value);
		resume?.();
	}

	function disconnect() {
		done = true;
	}

	return {
		consumer,
		listener,
		disconnect,
	};
}
