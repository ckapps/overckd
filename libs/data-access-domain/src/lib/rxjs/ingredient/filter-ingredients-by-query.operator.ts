import { regexpFromString } from '@overckd/core';
import { MonoTypeOperatorFunction } from 'rxjs';
import {
  Ingredient,
  IngredientQuery,
} from '../../models/ingredient/ingredient.model';
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
      query: { name, tags = [] },
    } = query;

    // Filter by name
    if (name) {
      if (!regexpFromString(name).test(item.name)) {
        return false;
      }
    }

    // Filter by tags
    if (tags.length > 0) {
      if (item.tags.length === 0) {
        return false;
      }

      const itemTagUris = item.tags.map(({ uri }) => uri);
      const hasMatchingTags = tags.some(uri => itemTagUris.includes(uri));

      if (!hasMatchingTags) {
        return false;
      }
    }

    return true;
  });
}
