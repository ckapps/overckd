import { Context, createReader, useContext } from '@marblejs/core';
import { RecipeCollectionRepository } from '@overckd/domain';
import { Reader } from 'fp-ts/lib/Reader';
import { defer, first, from } from 'rxjs';
import { RecipeCollectionDbCollectionToken } from '../db/collections/db.collections.tokens';
import { pluckData, pluckManyData } from '../db/rxjs';
import { RepositoryLogScope, scoped } from '../logging';

const logger = scoped<RepositoryLogScope>(RepositoryLogScope.RecipeCollection);

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

  return {
    // Queries
    getAll,
    getById,
  };
});
