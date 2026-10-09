import { Layer, Match } from 'effect';
import { HttpStaticServer } from 'effect/http';
import { MediaConfig } from './media.config';

/**
 * The route of the media the `media` section asks for: the files of a
 * directory under its `path`, or none.
 */
export const MediaLive = Layer.unwrap(
  MediaConfig.useSync(config =>
    Match.value(config).pipe(
      Match.discriminatorsExhaustive('type')({
        none: () => Layer.empty,
        filesystem: ({ dir, path }) =>
          HttpStaticServer.layer({
            root: dir,
            prefix: path,
            // No index file: a directory is not a medium
            index: undefined,
            // A file can be replaced under its name, so caches revalidate
            // with the ETag
            cacheControl: 'no-cache',
          }),
      }),
    ),
  ),
);
