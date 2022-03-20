export type IsArrayOfLengthN<T> = (values: unknown) => values is T[];
export type IsArrayOfLength1<T1> = (values: unknown) => values is [T1];
export type IsArrayOfLength2<T1, T2> = (values: unknown) => values is [T1, T2];
export type IsArrayOfLength3<T1, T2, T3> = (
  values: unknown,
) => values is [T1, T2, T3];
export type IsArrayOfLength4<T1, T2, T3, T4> = (
  values: unknown,
) => values is [T1, T2, T3, T4];

type U = unknown;

export function isArrayOfLength(length: 1): IsArrayOfLength1<U>;
export function isArrayOfLength(length: 2): IsArrayOfLength2<U, U>;
export function isArrayOfLength(length: 3): IsArrayOfLength3<U, U, U>;
export function isArrayOfLength(length: 4): IsArrayOfLength4<U, U, U, U>;
export function isArrayOfLength(length: number): IsArrayOfLengthN<U>;

export function isArrayOfLength(length: number): IsArrayOfLengthN<U> {
  return (values: unknown): values is unknown[] =>
    Array.isArray(values) && values.length === length;
}
