import { slug } from '@overckd/core';
import { Tag } from './tag.types';

/**
 * Creates a new `Tag` from a given `label`.
 *
 * @param label Tag label
 *
 * @returns
 */
export function createFromLabel(label: string): Tag {
  return {
    uri: slug(`#${label}`),
    label,
  };
}
