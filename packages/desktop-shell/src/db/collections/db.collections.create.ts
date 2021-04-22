import {
  bindEagerlyTo,
  ContextDependency,
  BoundDependency,
} from '@marblejs/core';
import {
  logEnterExit,
  LogLevel,
} from '@ckapp/rxjs-snafu/lib/cjs/log/operators';
import { RxDatabase } from 'rxdb';
import { from, Observable } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';

import { bulkInsertDbData } from '../from-filesystem/db.from-filesystem';
import {
  IngredientDbCollectionToken,
  RecipeCollectionDbCollectionToken,
  RecipeDbCollectionToken,
  TagDbCollectionToken,
} from './db.collections.tokens';
import { createRecipeCollectionDbCollection } from './recipe-collection/recipe-collection.db.create';
import { createRecipeDbCollection } from './recipe/recipe.db.create';
import { scoped, DbCollectionsLogScope } from '../../logging';
import { createIngredientDbCollection } from './ingredients/ingredient.db.create';
import { createTagDbCollection } from './tag/tag.db.create';

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
    switchMap(schema => bulkInsertDbData(db).pipe(mapTo(schema))),
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
