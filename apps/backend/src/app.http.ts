import { HttpCollectionLive } from '@_backend/collection/infra-http';
import { OverckdApi } from '@_backend/overckd/adapter-rest';
import { HttpRecipeLive } from '@_backend/recipe/infra-http';
import {
  HttpApiBuilder,
  HttpApiSwagger,
  HttpMiddleware,
  HttpServer,
} from '@effect/platform';
import * as Layer from 'effect/Layer';

const ApiLive = Layer.provide(HttpApiBuilder.api(OverckdApi), [
  HttpCollectionLive,
  HttpRecipeLive,
  // TODO: add more API implementations here
]);

export const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiSwagger.layer()),
  Layer.provide(HttpApiBuilder.middlewareOpenApi()),
  Layer.provide(HttpApiBuilder.middlewareCors()),
  Layer.provide(ApiLive),
  HttpServer.withLogAddress,
);
