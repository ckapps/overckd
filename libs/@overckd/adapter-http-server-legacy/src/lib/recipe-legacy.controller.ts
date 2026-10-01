import { RecipeQueries } from '@overckd/recipe/application';
import { Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';
import { OverckdLegacyApi } from './overckd-legacy.api';

/** Serves the `recipe` group of the legacy API with the recipe ports. */
export const RecipeLegacyHttpController = HttpApiBuilder.group(
  OverckdLegacyApi,
  'recipe',
  Effect.fn(function* (handlers) {
    const queries = yield* RecipeQueries;

    return handlers.handleAll({
      findById: ({ params }) => queries.findById(params),
    });
  }),
);
