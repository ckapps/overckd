import * as path from 'path';
import { Context, createReader, useContext } from '@marblejs/core';
import { Reader } from 'fp-ts/lib/Reader';
import { BehaviorSubject, from, of } from 'rxjs';
import { map, mapTo, mergeMap, tap, toArray } from 'rxjs/operators';

import { filterEndsWith } from '@ckapp/rxjs-snafu/lib/cjs/string/operators';

import { Recipe } from '@overckd/domain';
import { RecipeRepository } from '@overckd/domain/dist/repositories';
import {
  YamlRecipeFile,
  parseRecipeFile,
  toYamlFile,
  dumpYamlSafe,
} from '@overckd/yaml-parser';
import { writeFile } from '@overckd/yaml-parser/dist/fs';
import { fromDirectory } from '@overckd/yaml-parser/dist/rxjs';
import {
  parseYamlSafe,
  readFile,
} from '@overckd/yaml-parser/dist/rxjs/operators';

import { AppConfigToken } from '../config/config.token';
import { getPath, PathId } from '../paths';

async function saveRecipe(dir: string, id: string, recipe: Recipe) {
  const filename = path.resolve(dir, `${id}.recipe.yaml`);
  console.log('saving recipe', id);
  console.log('in', filename);

  const yamlRecipe = toYamlFile(recipe);
  const fileContent = dumpYamlSafe(yamlRecipe);

  return writeFile(filename, fileContent, { encoding: 'utf-8' });
}

function readAllRecipeFiles(dir: string) {
  return fromDirectory(dir).pipe(
    filterEndsWith('.recipe.yaml'),
    map(filename => path.resolve(dir, filename)),
    readFile({ encoding: 'utf-8' }),
    parseYamlSafe<YamlRecipeFile>(),
    map(doc => parseRecipeFile(doc)),
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
          const generatedId = recipe.name;

          // Now save the recipe
          return from(saveRecipe(recipesFolder, generatedId, recipe)).pipe(
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
    // add: recipe =>
    update: (r, name) => {
      throw new Error('Method not implemented.');
    },
  };
});
