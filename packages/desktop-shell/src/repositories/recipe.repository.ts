import { writeFile } from '@ckapp/rxjs-node-fs';
import { createReader, useContext } from '@marblejs/core';
import { RecipeRepository } from '@overckd/domain/dist/repositories';
import { yamlEncode } from '@overckd/yaml-parser';
import { recipeFile } from '@overckd/yaml-parser/dist/file-codec';
import * as path from 'path';
import { defer, from, of } from 'rxjs';
import { map, mapTo, mergeMap, switchMap, take } from 'rxjs/operators';

import { getPath, PathId } from '../paths';
import { RecipeDbCollectionToken } from '../db/collections/db.collections.tokens';
import { pluckManyData } from '../db/rxjs/pluck-many-data';
import { pluckData } from '../db/rxjs/pluck-data';
import { RepositoryLogScope, scoped } from '../logging';

const logger = scoped(RepositoryLogScope.Recipe);

export const RecipeFileRespository = createReader<RecipeRepository>(ask => {
  const recipeCollection = useContext(RecipeDbCollectionToken)(ask);
  const recipesFolder = getPath(PathId.Recipes);

  logger.silly(`setting up RecipeFileRespository`);

  // ================================================================================
  // Set up queries
  const findOneByNameQuery = recipeCollection.findOne().where('name');
  const findAllQuery = recipeCollection.find().$;

  // ================================================================================
  // Logging
  // recipeCollection.insert$.subscribe(changeEvent => console.dir(changeEvent));
  // recipeCollection.update$.subscribe(changeEvent => console.dir(changeEvent));
  // recipeCollection.remove$.subscribe(changeEvent => console.dir(changeEvent));

  // ================================================================================

  const getAll: RecipeRepository['getAll'] = () =>
    findAllQuery.pipe(pluckManyData(), take(1));

  const getByName: RecipeRepository['getByName'] = name =>
    defer(() => {
      console.log('called getByName with', name);
      return from(findOneByNameQuery.eq(name).exec());
    }).pipe(pluckData(), take(1));

  return {
    // Queries
    getAll,
    getByName,
    // Commands
    add: recipe => {
      return from(recipeCollection.upsert(recipe)).pipe(
        map(doc => {
          const item = doc.toJSON();
          const { name: id } = item;
          const filename = path.resolve(recipesFolder, `${id}.recipe.yaml`);
          return { item, filename };
        }),
        mergeMap(({ item, filename }) => {
          // Encode for saving
          return of(item).pipe(
            // Parse to yaml
            yamlEncode(recipeFile),
            // Save
            mergeMap(fileContent =>
              writeFile(filename, fileContent, { encoding: 'utf8' }),
            ),
            mapTo(item),
          );
        }),
      );
    },
    removeByName: id =>
      findOneByNameQuery
        .eq(id)
        .$.pipe(switchMap(doc => (!doc ? of(false) : doc.remove()))),
    update: (r, name) => {
      throw new Error('Method not implemented.');
    },
  };
});
