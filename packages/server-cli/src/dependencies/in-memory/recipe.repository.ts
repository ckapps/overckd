import { Context, createReader } from '@marblejs/core';
import { Reader } from 'fp-ts/lib/Reader';
import { Observable } from 'rxjs';

import { PortionKind } from '@overckd/domain/dist/portion-quantifier';
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
        steps: [
          'step 1',
          'step 2',
          { html: 'Loorem Ipsum dolor', styles: ['text-center'] },
        ],
        styles: {},
        tips: [],
      },
      {
        name: 'recipe 2',
        portion: {
          kind: PortionKind.Quantity,
          count: 2,
        },
        images: [],
        ingredients: [
          {
            amount: 3,
            unit: 'kg',
            name: 'Ingredient 1',
            alternatives: ['test'],
          },
          {
            amount: 10,
            unit: 'ml',
            name: 'Ingredient 2',
            optional: true,
          },
          {
            amount: 5,
            unit: 'TL',
            scaleFactor: 1 / 4,
            name: 'Ingredient with an scale factor of 0.25',
          },
          {
            amount: '1 Prise',
            name: 'Ingredient with textual amount',
          },
        ],
        steps: ['step 1', 'step 2', 'Loorem Ipsum dolor'],
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
