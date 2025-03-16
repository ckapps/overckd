import { TagId } from '@overckd/domain-experimental';
import { Effect } from 'effect';
import { TagRepo } from './tag.repostitory';

/**
 * Find a tag by its ID.
 * @param id Tag ID
 */
export const findById = (id: TagId) =>
  Effect.gen(function* () {
    const repo = yield* TagRepo;
    return yield* repo.findById(id);
  }).pipe(Effect.withSpan('Tag.findById', { attributes: { id } }));
