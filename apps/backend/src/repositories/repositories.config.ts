import { Config, Context, Layer, Schema } from 'effect';
import { ConfigFileSection } from '../common/config-file';

export const MemoryRepositoriesConfig = Schema.Struct({
  type: Schema.Literal('memory'),
});

/** The repositories to serve: one member per implementation, on `type`. */
export const FullRepositoriesConfig = Schema.Union([
  MemoryRepositoriesConfig,
]).annotate({
  description: 'The repositories to serve',
});
export type FullRepositoriesConfig = Schema.Schema.Type<
  typeof FullRepositoriesConfig
>;

/** The `repositories` configuration. */
export class RepositoriesConfig extends Context.Service<
  RepositoriesConfig,
  FullRepositoriesConfig
>()('@overckd/backend/RepositoriesConfig') {
  static readonly layer = Layer.effect(
    RepositoriesConfig,
    Config.schema(FullRepositoriesConfig, ConfigFileSection.Repositories).pipe(
      Config.withDefault<FullRepositoriesConfig>({ type: 'memory' }),
    ),
  );
}
