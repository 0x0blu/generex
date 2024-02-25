type AnyIterator<T = unknown, TReturn = unknown, TNext = unknown> =
  | Iterator<T, TReturn, TNext>
  | AsyncIterator<T, TReturn, TNext>;

type AnyIterable<T = unknown> = Iterable<T> | AsyncIterable<T>;

type IteratorYield<T extends AnyIterator> = T extends AnyIterator<infer T, any, any> ? T : never;
type IteratorReturn<T extends AnyIterator> = T extends AnyIterator<any, infer TReturn, any> ? TReturn : never;

type PromiseOr<T> = T | PromiseLike<T>;
