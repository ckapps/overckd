import { OverckdApi } from '@_backend/overckd/adapter-rest';
import { CollectionUseCase } from '@_shared/collection/application';
import { HttpApiBuilder } from '@effect/platform';
import { CollectionNotFound } from '@overckd/domain-experimental';
import { Effect, Layer, pipe } from 'effect';

export const HttpCollectionLive = HttpApiBuilder.group(
  OverckdApi,
  'recipe-collection',
  handlers =>
    Effect.gen(function* () {
      const recipeCollection = yield* CollectionUseCase;

      return handlers
        .handle('getAll', () => recipeCollection.getAll)
        .handle('findById', ({ path }) =>
          pipe(
            recipeCollection.findById(path.id),
            Effect.mapError(() => new CollectionNotFound({ id: path.id })),
          ),
        );
    }),
).pipe(Layer.provide([CollectionUseCase.Default]));
