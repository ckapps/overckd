import { Layer, Match } from 'effect';
import { MemoryReposLive } from './memory.repositories';
import { RepositoriesConfig } from './repositories.config';

const RepositoriesFromConfig = Layer.unwrap(
  RepositoriesConfig.useSync(config =>
    Match.value(config).pipe(
      Match.discriminatorsExhaustive('type')({
        memory: MemoryReposLive,
      }),
    ),
  ),
);

export const OverckdReposLive = RepositoriesFromConfig.pipe(
  Layer.provide(RepositoriesConfig.layer),
);
