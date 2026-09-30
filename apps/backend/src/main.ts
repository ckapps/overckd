import * as Layer from 'effect/Layer';
import { HttpLive } from './app.http';
import { CollectionTestRepo } from './collection.repo';
import { RecipeTestRepo } from './recipe.repo';

const TestReposLive = Layer.mergeAll(CollectionTestRepo, RecipeTestRepo);

export const OverckdBackend = HttpLive.pipe(
  // Provide repositories
  Layer.provide(TestReposLive),
);
