import { HttpCollectionLive } from '@_backend/collection/infra-http';
import { OverckdApi } from '@_backend/overckd/adapter-rest';
import {
  HttpApiBuilder,
  HttpApiSwagger,
  HttpMiddleware,
  HttpServer,
} from '@effect/platform';
import { NodeHttpServer } from '@effect/platform-node';
import { Layer } from 'effect';
import { createServer } from 'http';

const ApiLive = Layer.provide(HttpApiBuilder.api(OverckdApi), [
  HttpCollectionLive,
  // TODO: add more API implementations here
]);

export const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer()),
  Layer.provide(HttpApiBuilder.middlewareOpenApi()),
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
);
