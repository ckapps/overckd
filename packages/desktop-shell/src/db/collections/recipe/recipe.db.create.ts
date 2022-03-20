import { RxDatabase } from 'rxdb';
import { RxCollectionCreatorBase } from 'rxdb/dist/types/types';

import { schema } from './recipe.db.schema';

/**
 * Creates a new database collection in
 * the given `db`.
 *
 * @param db The database
 *
 * @returns
 * Observable that emits and completes when the
 * collection was added
 */
export function createRecipeDbCollection(
  db: RxDatabase,
): RxCollectionCreatorBase {
  return {
    schema,
  };
}
