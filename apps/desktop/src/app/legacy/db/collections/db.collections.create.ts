import { createIngredientDbCollection } from '@_shared/ingredient/infra-rxdb';
import { createRecipeCollectionDbCollection } from '@_shared/recipe-collection/infra-rxdb';
import { createRecipeDbCollection } from '@_shared/recipe/infra-rxdb';
import { createTagDbCollection } from '@_shared/tag/infra-rxdb';
import {
  logEnterExit,
  LogLevel,
} from '@ckapp/rxjs-snafu/lib/cjs/log/operators';
import {
  bindEagerlyTo,
  BoundDependency,
  ContextDependency,
} from '@marblejs/core';
import { RxDatabase } from 'rxdb';
import { from, map, Observable, switchMap } from 'rxjs';
import { DbCollectionsLogScope, scoped } from '../../logging';
import { bulkInsertDbData } from '../from-filesystem/db.from-filesystem';
import {
  IngredientDbCollectionToken,
  RecipeCollectionDbCollectionToken,
  RecipeDbCollectionToken,
  TagDbCollectionToken,
} from './db.collections.tokens';

type DbCollectionDependencies = BoundDependency<unknown, ContextDependency>[];

const logger = scoped(DbCollectionsLogScope.Collections);

/**
 * Creates the database schema
 *
 * @param db The database
 *
 * @returns
 * Observable that emits with the created database schema
 */
function createDbSchema(db: RxDatabase) {
  return from(
    db.addCollections({
      ingredients: createIngredientDbCollection(db),
      recipes: createRecipeDbCollection(db),
      recipe_collections: createRecipeCollectionDbCollection(db),
      tags: createTagDbCollection(db),
    }),
  ).pipe(
    logEnterExit('Adding DB collections', { logger, level: LogLevel.Silly }),
  );
}

/**
 * Configures the dependencies for the DB submodule
 *
 * @returns
 * Database dependencies
 */
export const configureDbCollectionDependencies = (
  db: RxDatabase,
): Observable<DbCollectionDependencies> => {
  const dbSchema$ = createDbSchema(db);

  return dbSchema$.pipe(
    switchMap(schema => bulkInsertDbData(db).pipe(map(() => schema))),
    map(schema => [
      // Collection dependencies
      bindEagerlyTo(IngredientDbCollectionToken)(() => schema.ingredients),
      bindEagerlyTo(RecipeDbCollectionToken)(() => schema.recipes),
      bindEagerlyTo(RecipeCollectionDbCollectionToken)(
        () => schema.recipe_collections,
      ),
      bindEagerlyTo(TagDbCollectionToken)(() => schema.tags),
    ]),
  );
};
