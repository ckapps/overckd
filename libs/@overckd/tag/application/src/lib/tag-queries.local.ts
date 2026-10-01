import { TagFindByIdPayload } from '@overckd/domain-experimental';
import { Effect, Layer } from 'effect';
import { TagQueries } from './tag-queries';
import { TagRepo } from './tag-repo';

/** `TagQueries` on top of a `TagRepo`. */
export const TagQueriesLocal = Layer.effect(
  TagQueries,
  Effect.gen(function* () {
    const repo = yield* TagRepo;

    return TagQueries.of({
      findById: Effect.fn('TagQueries.findById')(({ id }: TagFindByIdPayload) =>
        repo.findById(id),
      ),
    });
  }),
);
