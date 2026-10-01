import {
  Collection,
  CollectionFindByIdError,
  CollectionFindByIdPayload,
} from '@overckd/domain-experimental';
import { Context, Effect } from 'effect';

/** Inbound port: everything that reads collections. */
export class CollectionQueries extends Context.Service<
  CollectionQueries,
  {
    /**
     * Get all recipe collections.
     */
    readonly getAll: Effect.Effect<ReadonlyArray<Collection>>;

    /**
     * Find a recipe collection by its id.
     */
    readonly findById: (
      payload: CollectionFindByIdPayload,
    ) => Effect.Effect<Collection, CollectionFindByIdError>;
  }
>()('@overckd/collection/application/CollectionQueries') {}
