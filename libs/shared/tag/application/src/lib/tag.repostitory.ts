import { Tag, TagId, TagNotFound } from '@overckd/domain-experimental';
import { Context, Effect } from 'effect';

export class TagRepo extends Context.Tag('@overckd/tag/application/repo')<
  TagRepo,
  {
    /**
     * Find a tag by its ID.
     * @param id Tag ID
     */
    readonly findById: (id: TagId) => Effect.Effect<Tag, TagNotFound>;
  }
>() {}
