import { RxDatabase } from 'rxdb';

import { schema } from './tag.db.schema';

/**
 * Creates definition for a new DB collection
 *
 * @param db The database
 *
 * @returns
 */
export function createTagDbCollection(db: RxDatabase) {
  return {
    schema,
  };
}
