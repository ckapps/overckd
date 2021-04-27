import { Context, createReader, useContext } from '@marblejs/core';
import { IngredientRepository } from '@overckd/domain/dist/repositories';
import { Reader } from 'fp-ts/lib/Reader';
import { combineLatest, of } from 'rxjs';
import { first, map, pluck, switchMap } from 'rxjs/operators';

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
    let filterQuery = ingredientsDB.find();

    if (query.query.name) {
      filterQuery = filterQuery
        .where('name')
        .regex(new RegExp(`${query.query.name}`, 'ig'));
    }

    // Apply paging
    const { page = 0, size = 30 } = query;
    const pagedQuery = filterQuery.limit(size).skip(page * size);

    return combineLatest([
      filterQuery.$.pipe(pluck('length')),
      pagedQuery.$,
    ]).pipe(
      first(),
      switchMap(([count, paged]) =>
        of(paged).pipe(
          pluckManyData(),
          map(result => ({
            count,
            page,
            result,
            size,
          })),
        ),
      ),
    );
  };

  return {
    findByQuery,
  };
});
