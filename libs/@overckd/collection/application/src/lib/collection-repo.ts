import { Collection, CollectionId, CollectionNotFound } from '@overckd/domain';
import { Context, Effect } from 'effect';

/** Outbound port: where collections are stored. */
export class CollectionRepo extends Context.Service<
  CollectionRepo,
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
>()('@overckd/collection/application/CollectionRepo') {}
