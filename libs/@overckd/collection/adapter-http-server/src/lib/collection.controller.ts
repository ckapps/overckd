import { OverckdApi } from '@overckd/api-http';
import { CollectionQueries } from '@overckd/collection/application';
import { Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

/** Serves the `collection` group of the API with the collection ports. */
export const CollectionHttpController = HttpApiBuilder.group(
  OverckdApi,
  'collection',
  Effect.fn(function* (handlers) {
    const queries = yield* CollectionQueries;

    return handlers.handleAll({
      getAll: () => queries.getAll,
      findById: ({ params }) => queries.findById(params),
    });
  }),
);
