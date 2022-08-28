import type { AG } from "../types/generator";

type debounceState<T, TReturn> =
	| { type: "ready" | "debouncing"; next?: { value: T } }
	| { type: "return"; returnValue: TReturn };

export default async function* debounceAsync<T, TReturn>(generator: AG<T, TReturn>, ms: number): AG<T, TReturn> {
	let state: debounceState<T, TReturn> = { type: "ready" } as debounceState<T, TReturn>;
	let gettingNext = false;

	let resume: () => void = () => undefined;

	for (;;) {
		console.log(state);
		if (state.type == "ready" && state.next) {
			const value = state.next.value;

			state = { type: "debouncing" };
			console.log(state);

			setTimeout(() => {
				if (state.type == "debouncing") {
					state.type = "ready";
					resume();
				}
			}, ms);

			yield value;
		} else if (state.type == "return") {
			return state.returnValue;
		}

		if (!gettingNext) {
			console.log("getting next");
			gettingNext = true;

			Promise.resolve(generator.next()).then(next => {
				gettingNext = false;

				if (next.done) state = { type: "return", returnValue: next.value };
				else if (state.type == "return") return;
				else state.next = { value: next.value };

				resume();
			});
		}

		await new Promise<void>(fulfill => (resume = fulfill));
	}
}
