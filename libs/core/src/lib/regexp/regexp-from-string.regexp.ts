/**
 * Creates a regular expression from a string
 * @param n
 * @returns
 */
export const regexpFromString = (n: string) => new RegExp(`${n}`, 'gi');
