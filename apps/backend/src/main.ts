import { CollectionRepoMemory } from '@overckd/collection/adapter-memory';
import { Collection, CollectionId } from '@overckd/domain-experimental';
import * as Layer from 'effect/Layer';
import { HttpLive } from './app.http';
import { RecipeTestRepo } from './recipe.repo';

const TestReposLive = Layer.mergeAll(
  CollectionRepoMemory([
    Collection.make({
      id: CollectionId.make('1'),
      name: 'Test',
      description: 'Test description',
      recipes: [],
    }),
  ]),
  RecipeTestRepo,
);

export const OverckdBackend = HttpLive.pipe(
  // Provide repositories
  Layer.provide(TestReposLive),
);
