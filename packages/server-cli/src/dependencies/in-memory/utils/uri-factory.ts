import { slug } from '@overckd/domain/dist/core/string';

type UriFactory = (...s: string[]) => string;

/**
 * @param base The base parts of returned URIs
 *
 * @returns
 * Factory for creating prefixed URIs
 */
export function UriFactory(base: string[]): UriFactory {
  const parts = ['overckd:/', ...base];

  // Make sure that we get the prefix right
  if (parts.length === 1) {
    parts.push('');
  }

  return (...s: string[]): string => {
    return [...parts, ...s.map(slug)].join('/');
  };
}
