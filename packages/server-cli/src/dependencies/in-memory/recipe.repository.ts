import { Context, createReader } from '@marblejs/core';
import { Reader } from 'fp-ts/lib/Reader';
import { Observable } from 'rxjs';

import { Recipe } from '@overckd/domain/dist/recipe';
import { RecipeRepository } from '@overckd/domain/dist/repositories';

import { InMemoryRepo } from './in-memory-repo';

class RecipeRepo extends InMemoryRepo<Recipe> implements RecipeRepository {
  constructor() {
    super([
      {
        name: 'recipe 1',
        images: [],
        ingredients: [],
        steps: [],
        styles: {},
        tips: [],
      },
    ]);
  }

  getAll(): Observable<Recipe[]> {
    return this.all.asObservable();
  }

  getByName(name: string): Observable<Recipe | undefined> {
    return this.findItem({ name });
  }

  add(recipe: Recipe): Observable<Recipe> {
    return this._add(recipe);
  }

  removeByName(name: string): Observable<boolean> {
    return this._remove({ name });
  }

  update(recipe: Recipe, name: string): Observable<Recipe | undefined> {
    throw new Error('Method not implemented.');
  }

  equals(a: Recipe, b: Recipe): boolean {
    return a.name === b.name;
  }
}

export const MockRecipeRespository: Reader<
  Context,
  RecipeRepository
> = createReader<RecipeRepository>(() => {
  const repo = new RecipeRepo();

  return {
    add: (...args) => repo.add(...args),
    getAll: (...args) => repo.getAll(...args),
    getByName: (...args) => repo.getByName(...args),
    removeByName: (...args) => repo.removeByName(...args),
    update: (...args) => repo.update(...args),
  };
});
