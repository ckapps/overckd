import { Config, Context, Effect, Layer, Schema } from 'effect';

/** The versions of the HTTP API the backend can serve. */
export const ApiVersions = ['legacy', 'next'] as const;
export type ApiVersion = (typeof ApiVersions)[number];

const ServerConfigSchema = Schema.Struct({
  /** Port to run the server on */
  port: Schema.Int.pipe(Schema.withDecodingDefaultKey(Effect.succeed(3000))),
  /** Version of the HTTP API to serve */
  apiVersion: Schema.Literals(ApiVersions).pipe(
    Schema.withDecodingDefaultKey(Effect.succeed('legacy' as const)),
  ),
});

/** The `server` section of the config. */
export class ServerConfig extends Context.Service<
  ServerConfig,
  typeof ServerConfigSchema.Type
>()('@overckd/backend/ServerConfig') {
  static readonly layer = Layer.effect(
    ServerConfig,
    Config.schema(ServerConfigSchema, 'server').pipe(
      // Without a `server` section, every key takes its default
      Config.withDefault(Schema.decodeUnknownSync(ServerConfigSchema)({})),
    ),
  );
}
