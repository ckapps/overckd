import { RxDatabase } from 'rxdb';

import { schema } from './recipe-collection.db.schema';
import { RxCollectionCreatorBase } from 'rxdb/dist/types/types';

/**
 * Creates definition for a new DB collection
 *
 * @param db The database
 *
 * @returns
 */
export function createRecipeCollectionDbCollection(
  db: RxDatabase,
): RxCollectionCreatorBase {
  return {
    schema,
  };
}
