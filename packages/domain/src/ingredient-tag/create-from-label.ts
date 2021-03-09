import { slug } from '../core/string';
import { IngredientTag } from '../ingredient';

/**
 * Creates a new `IngredientTag` from a given `label`.
 *
 * @param label Tag label
 *
 * @returns
 */
export function createFromLabel(label: string): IngredientTag {
  return {
    uri: slug(`#${label}`),
    label,
  };
}
