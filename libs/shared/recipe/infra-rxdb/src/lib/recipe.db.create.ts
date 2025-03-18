import { RxDatabase } from 'rxdb';
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
export function createRecipeDbCollection(db: RxDatabase) {
  return {
    schema,
  };
}
