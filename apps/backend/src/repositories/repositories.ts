import { CollectionRepoMemory } from '@overckd/collection/adapter-memory';
import { RecipeRepoMemory } from '@overckd/recipe/adapter-memory';
import { Layer, Match } from 'effect';
import { RepositoriesConfig } from './repositories.config';
import { collections, recipes } from './seed';

const RepositoriesFromConfig = Layer.unwrap(
  RepositoriesConfig.useSync(config =>
    Match.value(config).pipe(
      Match.discriminatorsExhaustive('type')({
        memory: () =>
          Layer.mergeAll(
            CollectionRepoMemory(collections),
            RecipeRepoMemory(recipes),
          ),
      }),
    ),
  ),
);

export const OverckdReposLive = RepositoriesFromConfig.pipe(
  Layer.provide(RepositoriesConfig.layer),
);
