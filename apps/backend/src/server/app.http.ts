import {
  CollectionLegacyHttpController,
  OverckdLegacyApi,
  RecipeLegacyHttpController,
} from '@overckd/adapter-http-server-legacy';
import { OverckdApi as OverckdNextApi } from '@overckd/api-http';
import { CollectionHttpController } from '@overckd/collection/adapter-http-server';
import { CollectionQueriesLocal } from '@overckd/collection/application';
import { RecipeHttpController } from '@overckd/recipe/adapter-http-server';
import { RecipeQueriesLocal } from '@overckd/recipe/application';
import { Layer, Match } from 'effect';
import { HttpRouter } from 'effect/http';
import { HttpApiBuilder, HttpApiSwagger } from 'effect/http-api';
import { ApiVersion, ServerConfig } from './server.config';

const NextApiLive = Layer.mergeAll(
  HttpApiBuilder.layer(OverckdNextApi, {
    openapiPath: '/openapi.json',
  }).pipe(
    Layer.provide([
      CollectionHttpController,
      RecipeHttpController,
      // TODO: add more API implementations here
    ]),
  ),
  HttpApiSwagger.layer(OverckdNextApi),
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

const withApi = Match.type<ApiVersion>().pipe(
  Match.when('legacy', () => LegacyApiLive),
  Match.when('next', () => NextApiLive),
  Match.exhaustive,
);

// `HttpRouter.serve` applies the request logger and logs the server address
export const HttpApiLive = (version: ApiVersion) =>
  HttpRouter.serve(Layer.mergeAll(withApi(version), HttpRouter.cors())).pipe(
    Layer.provide([CollectionQueriesLocal, RecipeQueriesLocal]),
  );

/** The backend, serving the API version of `ServerConfig`. */
export const OverckdHttpApiLive = Layer.unwrap(
  ServerConfig.useSync(({ apiVersion }) => HttpApiLive(apiVersion)),
);
