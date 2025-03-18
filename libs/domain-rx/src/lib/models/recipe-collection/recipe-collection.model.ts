import { RecipeCollectionRepo } from '@_shared/recipe-collection/application';
import { useContext } from '@marblejs/core';
import {
  RecipeCollectionId,
  RecipeCollectionJson,
  RecipeCollectionNotFound,
} from '@overckd/domain-experimental';
import { Effect, Layer, Option, Schema } from 'effect';
import * as Arr from 'effect/Array';
import * as Fn from 'effect/Function';
import { firstValueFrom } from 'rxjs';
import { MarbleJsContextProvider } from '../../shared/marble-context-provider';
import { RecipeCollectionRepositoryToken } from '../models.tokens';

export const RecipeCollectionRepoMarbleInterop = Layer.effect(
  RecipeCollectionRepo,
  Effect.gen(function* () {
    const ctx = yield* MarbleJsContextProvider;
    const repo = useContext(RecipeCollectionRepositoryToken)(ctx);
    const decode = Schema.decodeSync(RecipeCollectionJson);

    return {
      findById: (id: RecipeCollectionId) =>
        Fn.pipe(
          Effect.promise(() => firstValueFrom(repo.getById(id))),
          Effect.map(Option.fromNullable),
          Effect.flatten,
          Effect.map(decode),
          Effect.mapError(() => RecipeCollectionNotFound.make({ id })),
        ),
      getAll: Fn.pipe(
        Effect.promise(() =>
          firstValueFrom(repo.getAll(), { defaultValue: [] }),
        ),
        Effect.map(Arr.map(c => decode(c))),
      ),
    };
  }),
);
