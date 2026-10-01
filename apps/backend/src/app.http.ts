import {
  CollectionLegacyHttpController,
  OverckdLegacyApi,
  RecipeLegacyHttpController,
} from '@overckd/adapter-http-server-legacy';
import { CollectionHttpController } from '@overckd/collection/adapter-http-server';
import { OverckdApi } from '@overckd/api-http';
import { RecipeHttpController } from '@overckd/recipe/adapter-http-server';
import { CollectionQueriesLocal } from '@overckd/collection/application';
import { RecipeQueriesLocal } from '@overckd/recipe/application';
import { Layer } from 'effect';
import { HttpRouter } from 'effect/http';
import { HttpApiBuilder, HttpApiSwagger } from 'effect/http-api';

/** The versions of the HTTP API the backend can serve. */
export const ApiVersions = ['legacy', 'next'] as const;
export type ApiVersion = (typeof ApiVersions)[number];

const NextApiLive = Layer.mergeAll(
  HttpApiBuilder.layer(OverckdApi, {
    openapiPath: '/openapi.json',
  }).pipe(
    Layer.provide([
      CollectionHttpController,
      RecipeHttpController,
      // TODO: add more API implementations here
    ]),
  ),
  HttpApiSwagger.layer(OverckdApi),
);

// The API of the legacy frontend, until its recipe pages are migrated
const LegacyApiLive = Layer.mergeAll(
  HttpApiBuilder.layer(OverckdLegacyApi, {
    openapiPath: '/openapi.json',
  }).pipe(
    Layer.provide([CollectionLegacyHttpController, RecipeLegacyHttpController]),
  ),
  HttpApiSwagger.layer(OverckdLegacyApi),
);

const ApiLive = { legacy: LegacyApiLive, next: NextApiLive };

// `HttpRouter.serve` applies the request logger and logs the server address
export const HttpLive = (version: ApiVersion) =>
  HttpRouter.serve(Layer.mergeAll(ApiLive[version], HttpRouter.cors())).pipe(
    Layer.provide([CollectionQueriesLocal, RecipeQueriesLocal]),
  );
