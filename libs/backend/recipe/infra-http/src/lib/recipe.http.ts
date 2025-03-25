import { OverckdApi } from '@_backend/overckd/adapter-rest';
import { RecipeUseCase } from '@_shared/recipe/application';
import { HttpApiBuilder } from '@effect/platform';
import { RecipeNotFound } from '@overckd/domain-experimental';
import { Effect, Layer, pipe } from 'effect';

export const HttpRecipeLive = HttpApiBuilder.group(
  OverckdApi,
  'recipe',
  handlers =>
    Effect.gen(function* () {
      const recipeCollection = yield* RecipeUseCase;

      return handlers.handle('findById', ({ path }) =>
        pipe(
          recipeCollection.findById(path.id),
          Effect.mapError(() => new RecipeNotFound({ id: path.id })),
        ),
      );
    }),
).pipe(Layer.provide([RecipeUseCase.Default]));
