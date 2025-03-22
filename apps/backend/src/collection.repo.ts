import { CollectionRepo } from '@_shared/collection/application';
import { Collection, CollectionId } from '@overckd/domain-experimental';
import { Effect, Layer } from 'effect';

export const CollectionTestRepo = Layer.effect(
  CollectionRepo,
  Effect.gen(function* () {
    return {
      getAll: Effect.succeed([
        Collection.make({
          id: CollectionId.make('1'),
          name: 'Test',
          description: 'Test description',
          recipes: [],
        }),
      ]),
      findById: id =>
        Effect.succeed(
          Collection.make({
            id,
            name: 'Test',
            description: 'Test description',
            recipes: [],
          }),
        ),
    };
  }),
);
