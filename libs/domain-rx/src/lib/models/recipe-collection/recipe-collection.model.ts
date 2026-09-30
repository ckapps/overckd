import { CollectionRepo } from '@_shared/collection/application';
import { useContext } from '@marblejs/core';
import {
  CollectionId,
  CollectionJson,
  CollectionNotFound,
} from '@overckd/domain-experimental';
import { Array as Arr, Effect, Function as Fn, Layer, Schema } from 'effect';
import { firstValueFrom } from 'rxjs';
import { MarbleJsContextProvider } from '../../shared/marble-context-provider';
import { RecipeCollectionRepositoryToken } from '../models.tokens';

export const RecipeCollectionRepoMarbleInterop = Layer.effect(
  CollectionRepo,
  Effect.gen(function* () {
    const ctx = yield* MarbleJsContextProvider;
    const repo = useContext(RecipeCollectionRepositoryToken)(ctx);
    const decode = Schema.decodeSync(CollectionJson);

    return {
      findById: (id: CollectionId) =>
        Fn.pipe(
          Effect.promise(() => firstValueFrom(repo.getById(id))),
          Effect.flatMap(Effect.fromNullishOr),
          Effect.map(decode),
          Effect.mapError(() => CollectionNotFound.make({ id })),
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
