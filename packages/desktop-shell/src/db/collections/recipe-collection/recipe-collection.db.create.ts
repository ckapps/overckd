import { RxDatabase } from 'rxdb';
import { schema } from './recipe-collection.db.schema';

/**
 * Creates definition for a new DB collection
 *
 * @param db The database
 *
 * @returns
 */
export function createRecipeCollectionDbCollection(db: RxDatabase) {
  return {
    schema,
  };
}
