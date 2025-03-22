import { NodeRuntime } from '@effect/platform-node';
import { Layer } from 'effect';
import { HttpLive } from './app.http';
import { CollectionTestRepo } from './collection.repo';

const TestReposLive = CollectionTestRepo;

HttpLive.pipe(
  // Provide repositories
  Layer.provide(TestReposLive),
  Layer.launch,
  NodeRuntime.runMain,
);
