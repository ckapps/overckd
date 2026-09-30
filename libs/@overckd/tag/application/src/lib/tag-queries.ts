import { Tag, TagId, TagNotFound } from '@overckd/domain-experimental';
import { Context, Effect } from 'effect';

/** Inbound port: everything that reads tags. */
export class TagQueries extends Context.Service<
  TagQueries,
  {
    /**
     * Find a tag by its ID.
     * @param id Tag ID
     */
    readonly findById: (id: TagId) => Effect.Effect<Tag, TagNotFound>;
  }
>()('@overckd/tag/application/TagQueries') {}
