import { slug } from './slug';

type UriFactory = (...s: string[]) => string;

export function UriFactory(base: string[]): UriFactory {
  const parts = ['overckd:/', ...base];

  return (...s: string[]): string => {
    return [...parts, ...s.map(slug)].join('/');
  };
}
