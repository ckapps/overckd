import { useContext } from '@marblejs/core';
import { Compat, RecipeId, RecipeNotFound } from '@overckd/domain-experimental';
import { RecipeRepo } from '@overckd/recipe/application';
import { Effect, Layer, Schema } from 'effect';
import { firstValueFrom } from 'rxjs';
import { MarbleJsContextProvider } from '../../shared/marble-context-provider';
import { RecipeRepositoryToken } from '../models.tokens';

/**
 * `RecipeRepo` on the legacy recipe repository. Legacy recipes have no id, so
 * `RecipePreparationLegacyJson` takes their name as id, and `findById` looks
 * recipes up by name.
 */
export const RecipeRepoMarbleInterop = Layer.effect(
  RecipeRepo,
  Effect.gen(function* () {
    const ctx = yield* MarbleJsContextProvider;
    const repo = useContext(RecipeRepositoryToken)(ctx);
    const decode = Schema.decodeUnknownEffect(
      Compat.RecipePreparationLegacyJson,
    );

    return RecipeRepo.of({
      findById: Effect.fn('RecipeRepo.findById')(function* (id: RecipeId) {
        const recipe = yield* Effect.promise(() =>
          firstValueFrom(repo.getByName(id), { defaultValue: undefined }),
        );
        if (recipe === undefined) {
          return yield* new RecipeNotFound({ id });
        }
        return yield* decode(recipe).pipe(Effect.orDie);
      }),
    });
  }),
);
