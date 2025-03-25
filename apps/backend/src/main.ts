import * as NodeRuntime from '@effect/platform-node/NodeRuntime';
import { Layer } from 'effect';
import { HttpLive } from './app.http';
import { CollectionTestRepo } from './collection.repo';
import { RecipeTestRepo } from './recipe.repo';

const TestReposLive = Layer.mergeAll(CollectionTestRepo, RecipeTestRepo);

HttpLive.pipe(
  // Provide repositories
  Layer.provide(TestReposLive),
  Layer.launch,
  NodeRuntime.runMain,
);
