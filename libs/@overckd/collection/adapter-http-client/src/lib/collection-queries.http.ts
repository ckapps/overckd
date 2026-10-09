import { OverckdApi } from '@overckd/api-http';
import { CollectionQueries } from '@overckd/collection/application';
import { CollectionFindByIdPayload } from '@overckd/domain';
import { Effect, Layer } from 'effect';
import { HttpClient } from 'effect/http';
import { HttpApiClient } from 'effect/http-api';

/** Typed client for the `collection` group, using the app-provided HttpClient. */
const makeClient = Effect.gen(function* () {
  const httpClient = yield* HttpClient.HttpClient;
  return yield* HttpApiClient.group(OverckdApi, {
    group: 'collection',
    httpClient,
  });
});

/** `CollectionQueries` over the HTTP API. */
export const CollectionQueriesHttp = Layer.effect(
  CollectionQueries,
  Effect.gen(function* () {
    const client = yield* makeClient;

    return CollectionQueries.of({
      getAll: client.getAll().pipe(
        // No typed errors on this port method: transport and decoding failures are defects.
        Effect.orDie,
        Effect.withSpan('CollectionQueries.getAll'),
      ),
      findById: Effect.fn('CollectionQueries.findById')(
        (payload: CollectionFindByIdPayload) =>
          client.findById({ params: payload }).pipe(
            // Keep the port's typed error (CollectionNotFound), everything else dies.
            Effect.catchTag(['HttpClientError', 'SchemaError'], Effect.die),
          ),
      ),
    });
  }),
);
