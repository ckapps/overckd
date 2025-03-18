import { OverckdApi } from '@_backend/overckd/adapter-rest';
import { HttpRecipeCollectionLive } from '@_backend/recipe-collection/infra-http';
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
  // HttpAccountsLive,
  // HttpGroupsLive,
  HttpRecipeCollectionLive,
]);

export const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer()),
  Layer.provide(HttpApiBuilder.middlewareOpenApi()),
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
);
