import { OverckdApi } from '@overckd/api-http';
import { CollectionQueries } from '@overckd/collection/application';
import { CollectionNotFound } from '@overckd/domain-experimental';
import { Effect, pipe } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

export const HttpCollectionLive = HttpApiBuilder.group(
  OverckdApi,
  'collection',
  handlers =>
    Effect.gen(function* () {
      const queries = yield* CollectionQueries;

      return handlers
        .handle('getAll', () => queries.getAll)
        .handle('findById', ({ params }) =>
          pipe(
            queries.findById(params.id),
            Effect.mapError(() => new CollectionNotFound({ id: params.id })),
          ),
        );
    }),
);
