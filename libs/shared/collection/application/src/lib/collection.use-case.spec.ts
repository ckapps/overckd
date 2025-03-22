import { Collection, CollectionId } from '@overckd/domain-experimental';
import { Effect } from 'effect';
import { describe, it, vi } from 'vitest';
import { CollectionRepo } from './collection.repostitory';
import { CollectionUseCase } from './collection.use-case';

describe('Collection/use-case', () => {
  const recipeCollection = Collection.make({
    description: 'description',
    id: CollectionId.make('id'),
    name: 'name',
    recipes: [],
  });

  describe('getAll', () => {
    const repo: any = {
      getAll: Effect.succeed([recipeCollection]),
      findById: vi.fn,
    };

    const getAll = Effect.gen(function* () {
      const uc = yield* CollectionUseCase;
      return yield* uc.getAll;
    }).pipe();

    it('should return all from repo', () => {
      const result = Effect.runSync(
        getAll.pipe(
          Effect.provide(CollectionUseCase.Default),
          Effect.provideService(CollectionRepo, repo),
        ),
      );
      expect(result).toEqual([recipeCollection]);
    });
  });
});
