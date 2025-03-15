import {
  RecipeCollection,
  RecipeCollectionId,
} from '@overckd/domain-experimental';
import { Effect } from 'effect';
import { describe, it, vi } from 'vitest';
import { RecipeCollectionRepo } from './recipe-collection.repostitory';
import * as UseCase from './recipe-collection.use-case';

describe('RecipeCollection/use-case', () => {
  const recipeCollection = RecipeCollection.make({
    description: 'description',
    id: RecipeCollectionId.make('id'),
    name: 'name',
    recipes: [],
  });

  describe('getAll', () => {
    const repo: any = {
      getAll: Effect.succeed([recipeCollection]),
      findById: vi.fn,
    };

    it('should return all from repo', () => {
      const result = Effect.runSync(
        UseCase.getAll.pipe(Effect.provideService(RecipeCollectionRepo, repo)),
      );
      expect(result).toEqual([recipeCollection]);
    });
  });
});
