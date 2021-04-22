import { switchExpandItems } from '@ckapp/rxjs-snafu/lib/cjs/array/operators';
import { Context, createReader, useContext } from '@marblejs/core';
import { IngredientRepository } from '@overckd/domain/dist/repositories';
import { filterIngredientsByQuery } from '@overckd/domain/dist/rxjs/ingredient';
import { asPagedResult } from '@overckd/domain/dist/rxjs/search';
import { Reader } from 'fp-ts/lib/Reader';
import { of } from 'rxjs';
import { first, withLatestFrom } from 'rxjs/operators';

import { IngredientDbCollectionToken } from '../db/collections/db.collections.tokens';
import { pluckManyData } from '../db/rxjs';
import { scoped, RepositoryLogScope } from '../logging';

const logger = scoped(RepositoryLogScope.Ingredient);

export const IngredientFileRepository: Reader<
  Context,
  IngredientRepository
> = createReader(ask => {
  const ingredientsDB = useContext(IngredientDbCollectionToken)(ask);

  logger.silly(`setting up IngredientFileRepository`);

  // ================================================================================
  // Set up queries
  const findAllQuery = ingredientsDB.find().$;

  // ================================================================================
  // Logging
  // ingredientsDB.insert$.subscribe(changeEvent => console.dir(changeEvent));
  // ingredientsDB.update$.subscribe(changeEvent => console.dir(changeEvent));
  // ingredientsDB.remove$.subscribe(changeEvent => console.dir(changeEvent));

  // ================================================================================
  // Queries
  const findByQuery: IngredientRepository['findByQuery'] = query => {
    const query$ = of(query);

    return findAllQuery.pipe(
      pluckManyData(),
      first(),
      switchExpandItems(),
      withLatestFrom(query$),
      filterIngredientsByQuery(),
      asPagedResult(),
    );
  };

  return {
    findByQuery,
  };
});
