import { CollectionRepoMemory } from '@overckd/collection/adapter-memory';
import { RecipeRepoMemory } from '@overckd/recipe/adapter-memory';
import * as Layer from 'effect/Layer';
import { HttpLive } from './app.http';
import { ServerConfig } from './config/server.config';
import { collections, recipes } from './seed';

const TestReposLive = Layer.mergeAll(
  CollectionRepoMemory(collections),
  RecipeRepoMemory(recipes),
);

/** The backend, serving the API version of `ServerConfig`. */
export const OverckdBackend = Layer.unwrap(
  ServerConfig.useSync(({ apiVersion }) => HttpLive(apiVersion)),
).pipe(
  // Provide repositories
  Layer.provide(TestReposLive),
);
