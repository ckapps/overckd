import * as path from 'path';
import { Context, createReader, useContext } from '@marblejs/core';
import { Reader } from 'fp-ts/lib/Reader';
import { BehaviorSubject, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { RecipeCollection } from '@overckd/domain';
import { RecipeCollectionRepository } from '@overckd/domain/dist/repositories/recipe-collection.repository';
import { fromRecipeCollection } from '@overckd/yaml-parser';

import { AppConfigToken } from '../config/config.token';

export const RecipeCollectionFileRespository: Reader<
  Context,
  RecipeCollectionRepository
> = createReader<RecipeCollectionRepository>(ask => {
  const { paths } = useContext(AppConfigToken)(ask);

  const filename = path.join(paths.app, 'overckd.collections.yaml');
  const allCollections = new BehaviorSubject<RecipeCollection[]>([]);

  const getById: RecipeCollectionRepository['getById'] = id =>
    allCollections.pipe(map(f => f.find(c => c.id === id)));

  return {
    // Queries
    getAll: () =>
      fromRecipeCollection(filename).pipe(
        tap(items => allCollections.next(items)),
      ),
    getById,
    // Commands
    add: collection =>
      of(collection).pipe(
        tap(c => allCollections.next([...allCollections.value, c])),
      ),
    removeById: id =>
      getById(id).pipe(
        map(x => {
          if (x === undefined) {
            return false;
          }

          const indexOfItem = allCollections.value.indexOf(x);
          allCollections.next(
            allCollections.value.filter((_, i) => i !== indexOfItem),
          );
          return true;
        }),
      ),
    update: (c, id) => {
      throw new Error('Method not implemented.');
    },
  };
});
