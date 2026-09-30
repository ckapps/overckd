import { HttpCollectionLive } from '@_backend/collection/infra-http';
import { OverckdApi } from '@_backend/overckd/adapter-rest';
import { HttpRecipeLive } from '@_backend/recipe/infra-http';
import { Layer } from 'effect';
import { HttpRouter } from 'effect/http';
import { HttpApiBuilder, HttpApiSwagger } from 'effect/http-api';

const ApiLive = HttpApiBuilder.layer(OverckdApi, {
  openapiPath: '/openapi.json',
}).pipe(
  Layer.provide([
    HttpCollectionLive,
    HttpRecipeLive,
    // TODO: add more API implementations here
  ]),
);

// `HttpRouter.serve` applies the request logger and logs the server address
export const HttpLive = HttpRouter.serve(
  Layer.mergeAll(ApiLive, HttpApiSwagger.layer(OverckdApi), HttpRouter.cors()),
);
