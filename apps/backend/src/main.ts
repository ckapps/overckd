import { NodeRuntime } from '@effect/platform-node';
import { Layer } from 'effect';
import { HttpLive } from './app.http';
import { RecipeCollectionTestRepo } from './recipe-collection.repo';

const TestReposLive = RecipeCollectionTestRepo;

HttpLive.pipe(
  // Provide repositories
  Layer.provide(TestReposLive),
  Layer.launch,
  NodeRuntime.runMain,
);
