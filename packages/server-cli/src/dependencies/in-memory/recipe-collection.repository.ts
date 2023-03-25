import { Context, createReader } from '@marblejs/core';
import { Reader } from 'fp-ts/lib/Reader';
import { Observable } from 'rxjs';

import { RecipeCollectionRepository } from '@overckd/domain/dist/repositories/recipe-collection.repository';
import { RecipeCollection } from '@overckd/domain/dist/models/recipe-collection/recipe-collection.model';

import { InMemoryRepo } from './in-memory-repo';

class RecipeCollectionRepo
  extends InMemoryRepo<RecipeCollection>
  implements RecipeCollectionRepository {
  constructor() {
    super([
      {
        id: 'collection1',
        name: 'collection 1',
        description: 'some collection',
        recipes: [
          {
            id: '1',
            name: 'recipe 1',
          },
          {
            id: '2',
            name: 'recipe 2',
          },
        ],
      },
      {
        id: 'collection2',
        name: 'other collection',
        description: '',
        recipes: [
          {
            id: 'awesome',
            name: 'my awesome recipe',
          },
        ],
      },
    ]);
  }

  getAll(): Observable<RecipeCollection[]> {
    return this.all.asObservable();
  }

  getById(id: string): Observable<RecipeCollection | undefined> {
    return this.findItem({ id });
  }

  add(collection: RecipeCollection): Observable<RecipeCollection> {
    return this._add(collection);
  }

  removeById(id: string): Observable<RecipeCollection> {
    return this._remove({ id });
  }

  update(
    collection: RecipeCollection,
    id: string,
  ): Observable<RecipeCollection | undefined> {
    return this._update(collection);
  }

  equals(a: RecipeCollection, b: Partial<RecipeCollection>): boolean {
    return a.id === b.id;
  }
}

export const MockRecipeCollectionRespository: Reader<
  Context,
  RecipeCollectionRepository
> = createReader<RecipeCollectionRepository>(() => {
  const repo = new RecipeCollectionRepo();

  return {
    add: (...args) => repo.add(...args),
    getAll: (...args) => repo.getAll(...args),
    getById: (...args) => repo.getById(...args),
    removeById: (...args) => repo.removeById(...args),
    update: (...args) => repo.update(...args),
  };
});
