import { RxDatabase } from 'rxdb';

import { schema } from './ingredient.db.schema';
import { RxCollectionCreatorBase } from 'rxdb/dist/types/types';

/**
 * Creates definition for a new DB collection
 *
 * @param db The database
 *
 * @returns
 */
export function createIngredientDbCollection(
  db: RxDatabase,
): RxCollectionCreatorBase {
  return {
    schema,
  };
}
