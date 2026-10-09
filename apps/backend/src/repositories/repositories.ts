import { Effect, Layer, Match } from 'effect';
import { MediaConfig, mediaUrl } from '../media/media.config';
import { FilesystemReposLive } from './filesystem.repositories';
import { MemoryReposLive } from './memory.repositories';
import { RepositoriesConfig } from './repositories.config';

const RepositoriesFromConfig = Layer.unwrap(
  Effect.gen(function* () {
    const config = yield* RepositoriesConfig;
    // The recipes link their images under the URL of the media
    const media = mediaUrl(yield* MediaConfig);
    return Match.value(config).pipe(
      Match.discriminatorsExhaustive('type')({
        memory: config => MemoryReposLive(config, media),
        filesystem: config => FilesystemReposLive(config, media),
      }),
    );
  }),
);

export const OverckdReposLive = RepositoriesFromConfig.pipe(
  Layer.provide([RepositoriesConfig.layer, MediaConfig.layer]),
);
