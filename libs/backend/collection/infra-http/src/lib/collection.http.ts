import { OverckdApi } from '@_backend/overckd/adapter-rest';
import { CollectionUseCase } from '@overckd/collection/application';
import { CollectionNotFound } from '@overckd/domain-experimental';
import { Effect, Layer, pipe } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';

export const HttpCollectionLive = HttpApiBuilder.group(
  OverckdApi,
  'recipe-collection',
  handlers =>
    Effect.gen(function* () {
      const recipeCollection = yield* CollectionUseCase;

      return handlers
        .handle('getAll', () => recipeCollection.getAll)
        .handle('findById', ({ params }) =>
          pipe(
            recipeCollection.findById(params.id),
            Effect.mapError(() => new CollectionNotFound({ id: params.id })),
          ),
        );
    }),
).pipe(Layer.provide([CollectionUseCase.layer]));
