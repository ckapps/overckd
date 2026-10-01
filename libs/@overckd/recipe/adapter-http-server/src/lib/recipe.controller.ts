import { OverckdApi } from '@overckd/api-http';
import { RecipeQueries } from '@overckd/recipe/application';
import { Effect } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

/** Serves the `recipe` group of the API with the recipe ports. */
export const RecipeHttpController = HttpApiBuilder.group(
  OverckdApi,
  'recipe',
  Effect.fn(function* (handlers) {
    const queries = yield* RecipeQueries;

    return handlers.handleAll({
      findById: ({ params }) => queries.findById(params),
    });
  }),
);
