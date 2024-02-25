export function range(end: number): Generator<number, undefined, undefined>;
export function range(start: number, end: number, step?: number): Generator<number, undefined, undefined>;

export function* range(start: number, end?: number, step: number = 1): Generator<number, undefined, undefined> {
  if (end == undefined) {
    end = start;
    start = 0;
  }

  if (step == 0) {
    throw new Error('step cannot be 0');
  }

  let next = start;

  if (step > 0) {
    while (next < end) {
      yield next;
      next += step;
    }
  } else {
    while (next > end) {
      yield next;
      next += step;
    }
  }
}
