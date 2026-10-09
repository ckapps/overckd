import { OverckdApi } from '@overckd/api-http';
import { RecipeFindByIdPayload } from '@overckd/domain-experimental';
import { RecipeQueries } from '@overckd/recipe/application';
import { Effect, Layer } from 'effect';
import { HttpClient } from 'effect/http';
import { HttpApiClient } from 'effect/http-api';

/** Typed client for the `recipe` group, using the app-provided HttpClient. */
const makeClient = Effect.gen(function* () {
  const httpClient = yield* HttpClient.HttpClient;
  return yield* HttpApiClient.group(OverckdApi, {
    group: 'recipe',
    httpClient,
  });
});

/** `RecipeQueries` over the HTTP API. */
export const RecipeQueriesHttp = Layer.effect(
  RecipeQueries,
  Effect.gen(function* () {
    const client = yield* makeClient;

    return RecipeQueries.of({
      findById: Effect.fn('RecipeQueries.findById')(
        (payload: RecipeFindByIdPayload) =>
          client.findById({ params: payload }).pipe(
            // Keep the port's typed error (RecipeNotFound), everything else dies.
            Effect.catchTag(['HttpClientError', 'SchemaError'], Effect.die),
          ),
      ),
    });
  }),
);
