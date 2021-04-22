import { Context, createReader, useContext } from '@marblejs/core';
import { RecipeCollectionRepository } from '@overckd/domain/dist/repositories/recipe-collection.repository';
import { Reader } from 'fp-ts/lib/Reader';
import { defer, from } from 'rxjs';
import { first, filter, mergeMap } from 'rxjs/operators';

import { RecipeCollectionDbCollectionToken } from '../db/collections/db.collections.tokens';
import { RepositoryLogScope, scoped } from '../logging';
import { pluckManyData, pluckData, pluckDataStrict } from '../db/rxjs';

const logger = scoped<RepositoryLogScope>(RepositoryLogScope.RecipeCollection);

function isNull(value: unknown): value is null {
  return value === null;
}

function isNotNull<T>(value: T | null): value is T {
  return !isNull(value);
}

export const RecipeCollectionFileRespository: Reader<
  Context,
  RecipeCollectionRepository
> = createReader<RecipeCollectionRepository>(ask => {
  const recipeCollectionCollection = useContext(
    RecipeCollectionDbCollectionToken,
  )(ask);
  logger.silly(`setting up RecipeCollectionFileRespository`);

  // ================================================================================
  // Set up queries
  // TODO: Rename to uri
  const findOneByIdQuery = recipeCollectionCollection.findOne().where('id');
  const findAllQuery = recipeCollectionCollection.find().$;

  // ================================================================================
  // Logging
  // recipeCollection.insert$.subscribe(changeEvent => console.dir(changeEvent));
  // recipeCollection.update$.subscribe(changeEvent => console.dir(changeEvent));
  // recipeCollection.remove$.subscribe(changeEvent => console.dir(changeEvent));

  // ================================================================================

  // ================================================================================
  // Queries
  const getAll: RecipeCollectionRepository['getAll'] = () =>
    findAllQuery.pipe(pluckManyData(), first());

  const getById: RecipeCollectionRepository['getById'] = id =>
    defer(() => {
      logger.silly('called getById with', id);
      return from(findOneByIdQuery.eq(id).exec());
    }).pipe(pluckData(), first());

  // ================================================================================
  // Commands
  const add: RecipeCollectionRepository['add'] = collection =>
    from(recipeCollectionCollection.upsert(collection)).pipe(pluckDataStrict());

  const removeById: RecipeCollectionRepository['removeById'] = id =>
    findOneByIdQuery.eq(id).$.pipe(
      filter(isNotNull),
      first(),
      mergeMap(value => value.remove()),
    );

  return {
    // Queries
    getAll,
    getById,
    // Commands
    add,
    removeById,
    update: (c, id) => {
      throw new Error('Method not implemented.');
    },
  };
});
