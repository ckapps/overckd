/**
 * Type guard for strings
 *
 * @param s
 *
 * @returns
 * `true` if `s` is of type string
 */
export function isString(s: unknown): s is string {
  return typeof s === 'string';
}
