import { MonoTypeOperatorFunction } from 'rxjs';

import { regexpFromString } from '../../core/regexp';
import { Tag, TagQuery } from '../../models/tag/tag.model';
import { filterByQuery } from '../search';

/**
 * @returns
 * Operator that filters ingredient tag items according to the
 * provided query.
 */
export function filterTagsByQuery(): MonoTypeOperatorFunction<[Tag, TagQuery]> {
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
