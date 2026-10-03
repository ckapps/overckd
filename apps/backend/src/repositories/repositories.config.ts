import { Config, Context, Effect, Layer, Match, Schema } from 'effect';
import { ConfigFile, ConfigFileSection } from '../common/config-file';
import {
  FilesystemCollectionRepositoryConfig,
  FilesystemRecipeRepositoryConfig,
} from './filesystem.repositories';
import { MemoryRepositoryConfig } from './memory.repositories';

export const MemoryRepositoriesConfig = Schema.Struct({
  type: Schema.Literal('memory'),
  recipes: Schema.optionalKey(MemoryRepositoryConfig).annotate({
    description: 'Configures the recipe repository',
  }),
  collections: Schema.optionalKey(MemoryRepositoryConfig).annotate({
    description: 'Configures the collections repository',
  }),
});
export type MemoryRepositoriesConfig = Schema.Schema.Type<
  typeof MemoryRepositoriesConfig
>;

export const FilesystemRepositoriesConfig = Schema.Struct({
  type: Schema.Literal('filesystem'),
  recipes: FilesystemRecipeRepositoryConfig.annotate({
    description: 'Configures the recipe repository',
  }),
  collections: FilesystemCollectionRepositoryConfig.annotate({
    description: 'Configures the collections repository',
  }),
});
export type FilesystemRepositoriesConfig = Schema.Schema.Type<
  typeof FilesystemRepositoriesConfig
>;

/** The repositories to serve: one member per implementation, on `type`. */
export const FullRepositoriesConfig = Schema.Union([
  MemoryRepositoriesConfig,
  FilesystemRepositoriesConfig,
]).annotate({
  description: 'The repositories to serve',
});
export type FullRepositoriesConfig = Schema.Schema.Type<
  typeof FullRepositoriesConfig
>;

/** The `repositories` configuration; its paths are absolute. */
export class RepositoriesConfig extends Context.Service<
  RepositoriesConfig,
  FullRepositoriesConfig
>()('@overckd/backend/RepositoriesConfig') {
  static readonly layer = Layer.effect(
    RepositoriesConfig,
    Effect.gen(function* () {
      const { resolve } = yield* ConfigFile;
      const config = yield* Config.schema(
        FullRepositoriesConfig,
        ConfigFileSection.Repositories,
      ).pipe(Config.withDefault<FullRepositoriesConfig>({ type: 'memory' }));

      /** `repository` with the glob of its seed resolved against the config file */
      const resolveSeed = (
        repository: MemoryRepositoryConfig,
      ): MemoryRepositoryConfig =>
        repository.seed === undefined
          ? repository
          : {
              ...repository,
              seed: {
                ...repository.seed,
                files: resolve(repository.seed.files),
              },
            };

      return Match.value(config).pipe(
        Match.discriminatorsExhaustive('type')({
          memory: (config): FullRepositoriesConfig => ({
            ...config,
            ...(config.recipes && { recipes: resolveSeed(config.recipes) }),
            ...(config.collections && {
              collections: resolveSeed(config.collections),
            }),
          }),
          filesystem: (config): FullRepositoriesConfig => ({
            ...config,
            recipes: { ...config.recipes, dir: resolve(config.recipes.dir) },
            collections: {
              ...config.collections,
              file: resolve(config.collections.file),
            },
          }),
        }),
      );
    }),
  );
}
