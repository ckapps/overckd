import { Tag, TagId, TagNotFound } from '@overckd/domain-experimental';
import { Context, Effect } from 'effect';

/** Outbound port: where tags are stored. */
export class TagRepo extends Context.Service<
  TagRepo,
  {
    /**
     * Find a tag by its ID.
     * @param id Tag ID
     */
    readonly findById: (id: TagId) => Effect.Effect<Tag, TagNotFound>;
  }
>()('@overckd/tag/application/TagRepo') {}
