import { Context, createReader } from '@marblejs/core';
import { Reader } from 'fp-ts/lib/Reader';

import { RecipeCollectionRepository } from '@overckd/domain/dist/repositories/recipe-collection.repository';
import { RecipeCollection } from '@overckd/domain/dist/recipe-collection';

import { InMemoryRepo } from './in-memory-repo';

class RecipeCollectionRepo
  extends InMemoryRepo<RecipeCollection>
  implements RecipeCollectionRepository {
  constructor() {
    super();

    this.all = [
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
    ];
  }

  async removeById(id: string): Promise<boolean> {
    const item = this.findById(id);
    if (!item) {
      return false;
    }

    return this._remove(item);
  }

  async getById(id: string): Promise<RecipeCollection | undefined> {
    return this.findById(id);
  }

  async update(
    collection: RecipeCollection,
    id: string,
  ): Promise<RecipeCollection> {
    const item = this.findById(id);

    if (item) {
      const index = this.all.indexOf(item);
      this.all[index] = collection;
    }

    return collection;
  }

  async add(collection: RecipeCollection): Promise<RecipeCollection> {
    this._add(collection);
    return collection;
  }

  async getAll(): Promise<RecipeCollection[]> {
    return this.all;
  }

  findById(id: string): RecipeCollection | undefined {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const fakeItem: RecipeCollection = { id };

    return this.all.find(i => this.equals(i, fakeItem));
  }

  equals(a: RecipeCollection, b: RecipeCollection): boolean {
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
