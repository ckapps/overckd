import { Config, Context, Effect, Layer, Schema } from 'effect';
import { ConfigFileSection } from '../common/config-file';

/** The versions of the HTTP API the backend can serve. */
export const ApiVersions = ['legacy', 'next'] as const;
export type ApiVersion = (typeof ApiVersions)[number];

export const FullServerConfig = Schema.Struct({
  /** Port to run the server on */
  port: Schema.Int.pipe(
    Schema.withDecodingDefaultKey(Effect.succeed(3000)),
  ).annotate({
    description: 'Port to run the server on',
  }),
  /** Version of the HTTP API to serve */
  apiVersion: Schema.Literals(ApiVersions)
    .pipe(Schema.withDecodingDefaultKey(Effect.succeed('legacy' as const)))
    .annotate({
      description: 'Version of the HTTP API to serve',
    }),
});
export type FullServerConfig = Schema.Schema.Type<typeof FullServerConfig>;

/** The `server` configuration. */
export class ServerConfig extends Context.Service<
  ServerConfig,
  FullServerConfig
>()('@overckd/backend/ServerConfig') {
  static readonly layer = Layer.effect(
    ServerConfig,
    Config.schema(FullServerConfig, ConfigFileSection.Server).pipe(
      Config.withDefault(Schema.decodeUnknownSync(FullServerConfig)({})),
    ),
  );
}
