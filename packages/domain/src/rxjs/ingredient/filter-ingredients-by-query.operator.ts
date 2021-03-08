import { MonoTypeOperatorFunction } from 'rxjs';

import { regexpFromString } from '../../core/regexp';
import { Ingredient } from '../../ingredient';
import { IngredientQuery } from '../../ingredient-queries';
import { filterByQuery } from '../search';

/**
 * @returns
 * Operator that filters ingredient items according to the
 * provided query.
 */
export function filterIngredientsByQuery(): MonoTypeOperatorFunction<
  [Ingredient, IngredientQuery]
> {
  return filterByQuery(([item, query]) => {
    const {
      query: { name, tags },
    } = query;

    // Filter by name
    if (name) {
      if (!regexpFromString(name).test(item.name)) {
        return false;
      }
    }

    // Filter by tags
    if (tags) {
      const itemTagUris = item.tags.map(({ uri }) => uri);
      const hasMatchingTags = tags.some(uri => itemTagUris.includes(uri));

      if (!hasMatchingTags) {
        return false;
      }
    }

    return true;
  });
}
