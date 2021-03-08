import { MonoTypeOperatorFunction } from 'rxjs';

import { regexpFromString } from '../../core/regexp';
import { IngredientTag } from '../../ingredient';
import { IngredientTagQuery } from '../../ingredient-queries';
import { filterByQuery } from '../search';

/**
 * @returns
 * Operator that filters ingredient tag items according to the
 * provided query.
 */
export function filterIngredientTagsByQuery(): MonoTypeOperatorFunction<
  [IngredientTag, IngredientTagQuery]
> {
  return filterByQuery(([item, query]) => {
    const {
      query: { label },
    } = query;

    // Filter by label
    if (label) {
      if (regexpFromString(label).test(item.label)) {
        return true;
      }
    }

    return false;
  });
}
