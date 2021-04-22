import {
  LogLevel,
  logEnterExit,
} from '@ckapp/rxjs-snafu/lib/cjs/log/operators';
import { RxDatabase } from 'rxdb';
import { combineLatest, defer, forkJoin, from, Observable } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import { readAllIngredientFiles } from '../../filesystem/read-all-ingredient-files';

import { readAllRecipeFiles } from '../../filesystem/read-all-recipe-files';
import { readAllTagFiles } from '../../filesystem/read-all-tag-files';
import { readRecipeCollectionFile } from '../../filesystem/read-recipe-collection-file';
import { scoped, DbLogScope } from '../../logging';
import { getPath, PathId } from '../../paths';

const logger = scoped(DbLogScope.Data);
const level = LogLevel.Silly;

function reduceItems<T>(allItems: T[][]): T[] {
  return allItems.reduce((acc, cur) => [...acc, ...cur], []);
}

export function recipesFromFiles$(paths: string[]) {
  return combineLatest(paths.map(readAllRecipeFiles)).pipe(map(reduceItems));
}

export function recipeCollectionsFromFiles$(paths: string[]) {
  return combineLatest(paths.map(readRecipeCollectionFile)).pipe(
    map(reduceItems),
  );
}

export function ingredientsFromFiles$(paths: string[]) {
  return combineLatest(paths.map(readAllIngredientFiles)).pipe(
    map(reduceItems),
  );
}

export function tagsFromFiles$(paths: string[]) {
  return combineLatest(paths.map(readAllTagFiles)).pipe(map(reduceItems));
}

export function bulkInsertDbData(
  db: RxDatabase,
): Observable<Record<string, unknown>> {
  return defer(() =>
    forkJoin({
      ingredients: ingredientsFromFiles$([getPath(PathId.Ingredients)]),
      recipes: recipesFromFiles$([getPath(PathId.Recipes)]),
      recipeCollections: recipeCollectionsFromFiles$([
        getPath(PathId.RecipeCollections),
      ]),
      tags: tagsFromFiles$([getPath(PathId.Tags)]),
    }),
  ).pipe(
    switchMap(m =>
      forkJoin([
        // Ingredients
        from(db.ingredients.bulkInsert(m.ingredients)).pipe(
          logEnterExit('Inserting ingredients', { logger, level }),
        ),
        // Recipes
        from(db.recipes.bulkInsert(m.recipes)).pipe(
          logEnterExit('Inserting recipes', { logger, level }),
        ),
        // Recipe collections
        from(db.recipe_collections.bulkInsert(m.recipeCollections)).pipe(
          logEnterExit('Inserting recipe collections', {
            logger,
            level,
          }),
        ),
        // Tags
        from(db.tags.bulkInsert(m.tags)).pipe(
          logEnterExit('Inserting tags', {
            logger,
            level,
          }),
        ),
      ]).pipe(mapTo(m)),
    ),
  );
}
