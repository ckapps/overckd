import { OverckdApi } from '@_backend/overckd/adapter-rest';
import { RecipeQueries } from '@overckd/recipe/application';
import { RecipeNotFound } from '@overckd/domain-experimental';
import { Effect, pipe } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

export const HttpRecipeLive = HttpApiBuilder.group(
  OverckdApi,
  'recipe',
  handlers =>
    Effect.gen(function* () {
      const queries = yield* RecipeQueries;

      return handlers.handle('findById', ({ params }) =>
        pipe(
          queries.findById(params.id),
          Effect.mapError(() => new RecipeNotFound({ id: params.id })),
        ),
      );
    }),
);
