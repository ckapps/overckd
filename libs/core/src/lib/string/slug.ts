export type Slug = string;

/**
 * Matches all single or repeated ' '.
 */
const replaceRegex = /\s+/g;

/**
 * Transforms a string `s` into its slug like representation
 *
 * @param s Any string
 *
 * @returns
 * Slug
 */
export function slug(s: string): Slug {
  return `${s.trim().toLowerCase()}`.replace(replaceRegex, '-');
}
