import { TagId } from '@overckd/domain-experimental';
import { Context, Effect, Layer, pipe } from 'effect';
import { TagRepo } from './tag.repostitory';

export class TagUseCase extends Context.Service<TagUseCase>()('TagUseCase', {
  make: Effect.gen(function* () {
    const repo = yield* TagRepo;

    /**
     * Find a tag by its ID.
     * @param id Tag ID
     */
    const findById = (id: TagId) =>
      pipe(
        repo.findById(id),
        Effect.withSpan('Tag.findById', { attributes: { id } }),
      );

    return { findById } as const;
  }),
}) {
  static readonly layer = Layer.effect(this, this.make);
}
