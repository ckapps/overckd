import { Context, createReader } from '@marblejs/core';
import { Reader } from 'fp-ts/lib/Reader';

import { Recipe } from '@overckd/domain/dist/recipe';

import { InMemoryRepo } from './in-memory-repo';
import { RecipeRepository } from '@overckd/domain/dist/repositories';

class RecipeRepo extends InMemoryRepo<Recipe> implements RecipeRepository {
  async add(recipe: Recipe): Promise<Recipe> {
    this._add(recipe);
    return recipe;
  }

  async getAll(): Promise<Recipe[]> {
    return this.all;
  }

  async removeByName(name: string): Promise<boolean> {
    const recipe = this.findByName(name);
    if (!recipe) {
      return false;
    }

    return this._remove(recipe);
  }

  async getByName(name: string): Promise<Recipe | undefined> {
    return this.findByName(name);
  }

  async update(recipe: Recipe, name: string): Promise<Recipe> {
    throw new Error('Method not implemented.');
  }

  findByName(name: string): Recipe | undefined {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const fakeRecipe: Recipe = { name };

    return this.all.find(i => this.equals(i, fakeRecipe));
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
