export type Result<T, E = string> =
  | { isSuccess: true; data: T; error?: never }
  | { isSuccess: false; data?: never; error: E; statusCode?: number };

export const Result = {
  ok: <T>(data: T): Result<T, never> => ({
    isSuccess: true,
    data,
  }),
  fail: <E = string>(error: E, statusCode: number = 400): Result<never, E> => ({
    isSuccess: false,
    error,
    statusCode,
  }),
};
