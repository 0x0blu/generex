export type G<T, TReturn> = Generator<T, TReturn, void>;
export type GYield<T extends G<unknown, unknown>> = T extends G<infer U, unknown> ? U : never;
export type GReturn<T extends G<unknown, unknown>> = T extends G<unknown, infer U> ? U : never;

export type AG<T, TReturn> = G<T, TReturn> | AsyncGenerator<T, TReturn, void>;
export type AGYield<T extends AG<unknown, unknown>> = T extends AG<infer U, unknown> ? U : never;
export type AGReturn<T extends AG<unknown, unknown>> = T extends AG<unknown, infer U> ? U : never;
