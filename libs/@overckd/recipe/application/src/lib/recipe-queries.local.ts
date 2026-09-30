import { RecipeId } from '@overckd/domain-experimental';
import { Effect, Layer } from 'effect';
import { RecipeQueries } from './recipe-queries';
import { RecipeRepo } from './recipe-repo';

/** `RecipeQueries` on top of a `RecipeRepo`. */
export const RecipeQueriesLocal = Layer.effect(
  RecipeQueries,
  Effect.gen(function* () {
    const repo = yield* RecipeRepo;

    return RecipeQueries.of({
      findById: Effect.fn('RecipeQueries.findById')((id: RecipeId) =>
        repo.findById(id),
      ),
    });
  }),
);
