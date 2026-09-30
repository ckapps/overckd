import { RxDatabase } from 'rxdb';
import { schema } from './ingredient.db.schema';

/**
 * Creates definition for a new DB collection
 *
 * @param db The database
 *
 * @returns
 */
export function createIngredientDbCollection(db: RxDatabase) {
  return {
    schema,
  };
}
