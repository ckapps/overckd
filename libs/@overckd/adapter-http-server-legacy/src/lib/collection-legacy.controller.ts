import { CollectionQueries } from '@overckd/collection/application';
import { Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';
import { OverckdLegacyApi } from './overckd-legacy.api';

/** Serves the `collection` group of the legacy API with the collection ports. */
export const CollectionLegacyHttpController = HttpApiBuilder.group(
  OverckdLegacyApi,
  'collection',
  Effect.fn(function* (handlers) {
    const queries = yield* CollectionQueries;

    return handlers.handleAll({
      getAll: () => queries.getAll,
      findById: ({ params }) => queries.findById(params),
    });
  }),
);
