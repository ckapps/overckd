import {
  Collection,
  CollectionId,
  CollectionNotFound,
  RecipeId,
  RecipeRef,
} from '@overckd/domain-experimental';
import { Effect, Layer } from 'effect';
import { describe, expect, it } from 'vitest';
import { CollectionRepo } from '@overckd/collection/application';

// Every collection holds a recipe, and a recipe ref's id is its name: the
// collections file keeps only collections with recipes, and names its recipes
// without ids.

const desserts = Collection.make({
  id: CollectionId.make('desserts'),
  name: 'Desserts',
  description: '',
  recipes: [
    RecipeRef.make({ id: RecipeId.make('Pancakes'), name: 'Pancakes' }),
  ],
});

const mains = Collection.make({
  id: CollectionId.make('mains'),
  name: 'Mains',
  description: 'Main courses',
  recipes: [RecipeRef.make({ id: RecipeId.make('Bread'), name: 'Bread' })],
});

/**
 * Registers the tests every `CollectionRepo` implementation must pass.
 * @param makeRepo Builds the repository, holding the given collections
 */
export const collectionRepoConformance = (
  makeRepo: (seed: ReadonlyArray<Collection>) => Layer.Layer<CollectionRepo>,
) => {
  const run = <A, E>(
    seed: ReadonlyArray<Collection>,
    effect: Effect.Effect<A, E, CollectionRepo>,
  ) => Effect.runPromise(effect.pipe(Effect.provide(makeRepo(seed))));

  describe('CollectionRepo conformance', () => {
    it('returns no collections when it holds none', async () => {
      const all = await run(
        [],
        CollectionRepo.use(repo => repo.getAll),
      );
      expect(all).toEqual([]);
    });

    it('returns all collections', async () => {
      const all = await run(
        [desserts, mains],
        CollectionRepo.use(repo => repo.getAll),
      );
      expect(all).toHaveLength(2);
      expect(all).toEqual(expect.arrayContaining([desserts, mains]));
    });

    it('finds a collection by its id', async () => {
      const found = await run(
        [desserts, mains],
        CollectionRepo.use(repo => repo.findById(mains.id)),
      );
      expect(found).toEqual(mains);
    });

    it('fails with CollectionNotFound for unknown ids', async () => {
      const error = await run(
        [desserts],
        CollectionRepo.use(repo =>
          repo.findById(CollectionId.make('nope')),
        ).pipe(Effect.flip),
      );
      expect(error).toBeInstanceOf(CollectionNotFound);
    });
  });
};
