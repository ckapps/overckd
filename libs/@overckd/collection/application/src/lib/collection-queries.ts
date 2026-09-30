import {
  Collection,
  CollectionId,
  CollectionNotFound,
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
     * @param id Id of the recipe collection
     */
    readonly findById: (
      id: CollectionId,
    ) => Effect.Effect<Collection, CollectionNotFound>;
  }
>()('@overckd/collection/application/CollectionQueries') {}
