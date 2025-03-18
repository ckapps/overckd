import { RecipeCollectionRepo } from '@_shared/recipe-collection/application';
import {
  RecipeCollection,
  RecipeCollectionId,
} from '@overckd/domain-experimental';
import { Effect, Layer } from 'effect';

export const RecipeCollectionTestRepo = Layer.effect(
  RecipeCollectionRepo,
  Effect.gen(function* () {
    return {
      getAll: Effect.succeed([
        RecipeCollection.make({
          id: RecipeCollectionId.make('1'),
          name: 'Test',
          description: 'Test description',
          recipes: [],
        }),
      ]),
      findById: id =>
        Effect.succeed(
          RecipeCollection.make({
            id,
            name: 'Test',
            description: 'Test description',
            recipes: [],
          }),
        ),
    };
  }),
);
