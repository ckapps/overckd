import { Tag, TagFindByIdError, TagFindByIdPayload } from '@overckd/domain';
import { Context, Effect } from 'effect';

/** Inbound port: everything that reads tags. */
export class TagQueries extends Context.Service<
  TagQueries,
  {
    /**
     * Find a tag by its ID.
     */
    readonly findById: (
      payload: TagFindByIdPayload,
    ) => Effect.Effect<Tag, TagFindByIdError>;
  }
>()('@overckd/tag/application/TagQueries') {}
