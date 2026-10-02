import { Config, Context, Effect, Layer, Schema } from 'effect';
import { ConfigFile, ConfigFileSection } from '../common/config-file';
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

/** The repositories to serve: one member per implementation, on `type`. */
export const FullRepositoriesConfig = Schema.Union([
  MemoryRepositoriesConfig,
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

      return {
        ...config,
        ...(config.recipes && { recipes: resolveSeed(config.recipes) }),
        ...(config.collections && {
          collections: resolveSeed(config.collections),
        }),
      };
    }),
  );
}
