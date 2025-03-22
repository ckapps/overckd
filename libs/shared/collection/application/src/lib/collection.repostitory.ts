import {
  Collection,
  CollectionId,
  CollectionNotFound,
} from '@overckd/domain-experimental';
import { Context, Effect } from 'effect';

export class CollectionRepo extends Context.Tag(
  '@overckd/collection/application/repo',
)<
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
>() {}
