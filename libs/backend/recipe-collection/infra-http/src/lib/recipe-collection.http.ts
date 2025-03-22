import { OverckdApi } from '@_backend/overckd/adapter-rest';
import { RecipeCollectionUseCase } from '@_shared/recipe-collection/application';
import { HttpApiBuilder } from '@effect/platform';
import { RecipeCollectionNotFound } from '@overckd/domain-experimental';
import { Effect, Layer, pipe } from 'effect';

export const HttpRecipeCollectionLive = HttpApiBuilder.group(
  OverckdApi,
  'recipe-collection',
  handlers =>
    Effect.gen(function* () {
      const recipeCollection = yield* RecipeCollectionUseCase;

      return handlers
        .handle('getAll', () => pipe(recipeCollection.getAll))
        .handle('findById', ({ path }) =>
          pipe(
            recipeCollection.findById(path.id),
            Effect.mapError(
              () => new RecipeCollectionNotFound({ id: path.id }),
            ),
          ),
        );
    }),
).pipe(Layer.provide([RecipeCollectionUseCase.Default]));
