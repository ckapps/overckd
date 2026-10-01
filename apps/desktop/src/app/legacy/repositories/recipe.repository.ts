import { createReader, useContext } from '@marblejs/core';
import { RecipeRepository } from '@overckd/domain';
import { defer, from, map, mergeMap, take } from 'rxjs';
import { RecipeDbCollectionToken } from '../db/collections/db.collections.tokens';
import { pluckData } from '../db/rxjs/pluck-data';
import { pluckManyData } from '../db/rxjs/pluck-many-data';
import { RepositoryLogScope, scoped } from '../logging';

const logger = scoped(RepositoryLogScope.Recipe);

export const RecipeFileRespository = createReader<RecipeRepository>(ask => {
  const recipeCollection = useContext(RecipeDbCollectionToken)(ask);

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
    add: () => {
      throw new Error('Method not implemented.');
    },
    removeByName: id =>
      findOneByNameQuery.eq(id).$.pipe(
        mergeMap(doc => {
          if (!doc) {
            // TODO(db): Make an error class
            throw new Error('not found');
          }
          return from(doc.remove()).pipe(map(value => value.toMutableJSON()));
        }),
      ),
    update: (r, name) => {
      throw new Error('Method not implemented.');
    },
  };
});
