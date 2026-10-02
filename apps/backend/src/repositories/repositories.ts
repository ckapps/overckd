import { CollectionRepoMemory } from '@overckd/collection/adapter-memory';
import { RecipeRepoMemory } from '@overckd/recipe/adapter-memory';
import * as Layer from 'effect/Layer';
import { collections, recipes } from './seed';

const TestReposLive = Layer.mergeAll(
  CollectionRepoMemory(collections),
  RecipeRepoMemory(recipes),
);

export const OverckdReposLive = TestReposLive;
