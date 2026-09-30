import { OverckdApi } from '@_backend/overckd/adapter-rest';
import { RecipeUseCase } from '@_shared/recipe/application';
import { RecipeNotFound } from '@overckd/domain-experimental';
import { Effect, Layer, pipe } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

export const HttpRecipeLive = HttpApiBuilder.group(
  OverckdApi,
  'recipe',
  handlers =>
    Effect.gen(function* () {
      const recipeCollection = yield* RecipeUseCase;

      return handlers.handle('findById', ({ params }) =>
        pipe(
          recipeCollection.findById(params.id),
          Effect.mapError(() => new RecipeNotFound({ id: params.id })),
        ),
      );
    }),
).pipe(Layer.provide([RecipeUseCase.layer]));
