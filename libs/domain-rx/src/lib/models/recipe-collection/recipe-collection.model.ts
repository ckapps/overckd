import { RecipeCollectionRepo } from '@_shared/recipe-collection/application';
import { useContext } from '@marblejs/core';
import {
  RecipeCollectionFromObject,
  RecipeCollectionId,
  RecipeCollectionNotFound,
} from '@overckd/domain-experimental';
import { Effect, Layer, Option, Schema } from 'effect';
import * as Arr from 'effect/Array';
import * as Fn from 'effect/Function';
import { firstValueFrom } from 'rxjs';
import { MarbleJsContextProvider } from '../../shared/marble-context-provider';
import { RecipeCollectionRepositoryToken } from '../models.tokens';

const decode = Schema.decodeSync(RecipeCollectionFromObject);

export const RecipeCollectionRepoMarbleInterop = Layer.effect(
  RecipeCollectionRepo,
  Effect.gen(function* () {
    const ctx = yield* MarbleJsContextProvider;
    const repo = useContext(RecipeCollectionRepositoryToken)(ctx);

    return {
      findById: (id: RecipeCollectionId) =>
        Effect.promise(() => firstValueFrom(repo.getById(id))).pipe(
          Effect.map(Option.fromNullable),
          Effect.flatMap(
            Fn.flow(
              Option.map(Effect.succeed),
              Option.getOrElse(() =>
                Effect.fail(RecipeCollectionNotFound.make({ id })),
              ),
            ),
          ),
          Effect.map(collection => decode(collection)),
        ),
      getAll: Effect.promise(() =>
        firstValueFrom(repo.getAll().pipe(), {
          defaultValue: [],
        }),
      ).pipe(Effect.map(Arr.map(c => decode(c)))),
    };
  }),
);
