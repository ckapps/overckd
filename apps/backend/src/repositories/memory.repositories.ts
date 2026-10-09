import { readCollectionsFile } from '@overckd/collection/adapter-fs';
import { CollectionRepoMemory } from '@overckd/collection/adapter-memory';
import { readRecipeFile } from '@overckd/recipe/adapter-fs';
import { RecipeRepoMemory } from '@overckd/recipe/adapter-memory';
import { Effect, FileSystem, Layer, PlatformError, Schema } from 'effect';
import { MemoryRepositoriesConfig } from './repositories.config';

/** Configuration for seeding a memory-based repository. */
export const SeedConfig = Schema.Struct({
  /** A glob, relative to the config file */
  files: Schema.String.annotate({
    description: 'A glob of the files, relative to the config file',
  }),
});
export type SeedConfig = Schema.Schema.Type<typeof SeedConfig>;

/** Configuration for a memory-based repository. */
export const MemoryRepositoryConfig = Schema.Struct({
  seed: Schema.optionalKey(SeedConfig).annotate({
    description: 'The seed to fill the repository from at startup',
  }),
});
export type MemoryRepositoryConfig = Schema.Schema.Type<
  typeof MemoryRepositoryConfig
>;

/**
 * Reads the files that match the glob of `seed` with `read`. Without a seed
 * there are none.
 */
const readSeed = <A, E, R>(
  seed: SeedConfig | undefined,
  read: (file: string) => Effect.Effect<A, E, R>,
): Effect.Effect<
  ReadonlyArray<A>,
  E | PlatformError.PlatformError,
  R | FileSystem.FileSystem
> =>
  seed === undefined
    ? Effect.succeed([])
    : FileSystem.FileSystem.use(fs => fs.glob(seed.files)).pipe(
        Effect.flatMap(files =>
          Effect.forEach(files, file => read(file), {
            concurrency: 'unbounded',
          }),
        ),
      );

/**
 * Memory repositories, each filled from the files of its seed at startup. The
 * recipes link their images under `mediaUrl`, if any.
 */
export const MemoryReposLive = (
  { recipes, collections }: MemoryRepositoriesConfig,
  mediaUrl: string | undefined,
) =>
  Layer.mergeAll(
    Layer.unwrap(
      readSeed(recipes?.seed, file =>
        readRecipeFile({ path: file, codec: 'yaml', mediaUrl }),
      ).pipe(Effect.map(RecipeRepoMemory)),
    ),
    Layer.unwrap(
      readSeed(collections?.seed, file =>
        readCollectionsFile(file, 'yaml'),
      ).pipe(Effect.map(files => CollectionRepoMemory(files.flat()))),
    ),
  );
