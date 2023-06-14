import {
  isArrayOfLength,
  IsArrayOfLength1,
  IsArrayOfLength2,
  IsArrayOfLength3,
  IsArrayOfLength4,
  IsArrayOfLengthN,
} from './is-array-of-length';
import { isArrayOfType } from './is-array-of-type';

export function isArrayOfLengthAndType<T>(
  length: 1,
  predicate: (s: unknown) => s is T,
): IsArrayOfLength1<T>;
export function isArrayOfLengthAndType<T>(
  length: 2,
  predicate: (s: unknown) => s is T,
): IsArrayOfLength2<T, T>;
export function isArrayOfLengthAndType<T>(
  length: 3,
  predicate: (s: unknown) => s is T,
): IsArrayOfLength3<T, T, T>;
export function isArrayOfLengthAndType<T>(
  length: 4,
  predicate: (s: unknown) => s is T,
): IsArrayOfLength4<T, T, T, T>;
export function isArrayOfLengthAndType<T>(
  length: number,
  predicate: (s: unknown) => s is T,
): IsArrayOfLengthN<T>;

export function isArrayOfLengthAndType<T>(
  length: number,
  predicate: (s: unknown) => s is T,
): IsArrayOfLengthN<T> {
  const lengthGuard = isArrayOfLength(length);
  const typeGuard = isArrayOfType(predicate);

  return (values: unknown): values is T[] =>
    lengthGuard(values) && typeGuard(values);
}
