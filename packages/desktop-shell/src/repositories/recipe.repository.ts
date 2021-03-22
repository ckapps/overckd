import { filterEndsWith } from '@ckapp/rxjs-snafu/lib/cjs/string/operators';
import { readDir, readFile, writeFile } from '@ckapp/rxjs-node-fs';
import { Context, createReader, useContext } from '@marblejs/core';
import { Reader } from 'fp-ts/lib/Reader';
import * as path from 'path';
import { BehaviorSubject, from, of } from 'rxjs';
import { map, mapTo, mergeMap, tap, toArray } from 'rxjs/operators';

import { Recipe } from '@overckd/domain';
import { RecipeRepository } from '@overckd/domain/dist/repositories';
import { yamlDecode, yamlEncode } from '@overckd/yaml-parser';
import { recipeFile } from '@overckd/yaml-parser/dist/file-codec';

import { AppConfigToken } from '../config/config.token';
import { getPath, PathId } from '../paths';

function readAllRecipeFiles(dir: string) {
  return readDir(dir).pipe(
    mergeMap(paths => from(paths)),
    filterEndsWith('.recipe.yaml'),
    map(filename => path.resolve(dir, filename)),
    mergeMap(path => readFile(path, { encoding: 'utf-8' })),
    yamlDecode(recipeFile),
    toArray(),
  );
}

export const RecipeFileRespository: Reader<
  Context,
  RecipeRepository
> = createReader<RecipeRepository>(ask => {
  const { paths } = useContext(AppConfigToken)(ask);

  const recipesFolder = getPath(PathId.Recipes);
  const allRecipes = new BehaviorSubject<Recipe[]>([]);

  const getAll: RecipeRepository['getAll'] = () =>
    readAllRecipeFiles(recipesFolder).pipe(
      tap(items => allRecipes.next(items)),
    );

  const getByName: RecipeRepository['getByName'] = name =>
    getAll().pipe(map(f => f.find(c => c.name === name)));

  return {
    // Queries
    getAll,
    getByName,
    // Commands
    add: recipe =>
      of(recipe).pipe(
        mergeMap(r => {
          // Generate some id for saving the recipe
          const id = recipe.name;
          const filename = path.resolve(recipesFolder, `${id}.recipe.yaml`);

          // Encode for saving
          return of(recipe).pipe(
            yamlEncode(recipeFile),
            // Now save the recipe
            mergeMap(fileContent =>
              writeFile(filename, fileContent, { encoding: 'utf8' }),
            ),
            mapTo(r),
          );
        }),
        tap(c => allRecipes.next([...allRecipes.value, c])),
      ),
    removeByName: id =>
      getByName(id).pipe(
        map(x => {
          if (x === undefined) {
            return false;
          }

          const indexOfItem = allRecipes.value.indexOf(x);
          allRecipes.next(allRecipes.value.filter((_, i) => i !== indexOfItem));
          return true;
        }),
      ),
    update: (r, name) => {
      throw new Error('Method not implemented.');
    },
  };
});
