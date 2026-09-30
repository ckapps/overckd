import { RecipeRepo } from '@_shared/recipe/application';
import {
  IngredientAmount,
  IngredientId,
  NonEmptyHtmlString,
  Portion,
  RecipeId,
  RecipeIngredient,
  RecipePreparation,
} from '@overckd/domain-experimental';
import { Effect, Layer, Option as O, Schema } from 'effect';

export const RecipeTestRepo = Layer.effect(
  RecipeRepo,
  // eslint-disable-next-line require-yield
  Effect.gen(function* () {
    const decode = Schema.decodeEffect(RecipePreparation);

    const unitIngredientAmount: IngredientAmount = {
      _tag: 'UnitIngredientAmount' as const,
      value: 1,
      unit: 'g',
      scaleFactor: 1,
    };
    // v4 `Schema.Class` encoders require actual class instances
    const unitIngredient = RecipeIngredient.make({
      uri: IngredientId.make('ingredient'),
      name: 'ingredient',
      amount: O.some(unitIngredientAmount),
      optional: false,
    });

    const quantityPortion: Portion.Portion = {
      kind: 'quantity',
      label: O.none(),
      quantity: 1,
    };

    const recipe: RecipePreparation = {
      _tag: 'BasicRecipePreparation',
      id: RecipeId.make('my-recipe'),
      name: 'name',
      basedOn: [],
      ingredients: [unitIngredient],
      portion: quantityPortion,
      steps: [
        { instruction: NonEmptyHtmlString.make('Step 1') },
        { instruction: NonEmptyHtmlString.make('Step 2') },
      ],
    };

    return {
      findById: id => Effect.succeed(recipe),
    };
  }),
);
