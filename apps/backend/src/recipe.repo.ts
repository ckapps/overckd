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
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as O from 'effect/Option';
import * as Schema from 'effect/Schema';

export const RecipeTestRepo = Layer.effect(
  RecipeRepo,
  Effect.gen(function* () {
    const decode = Schema.decode(RecipePreparation);

    const unitIngredientAmount: IngredientAmount = {
      _tag: 'UnitIngredientAmount' as const,
      value: 1,
      unit: 'g',
      scaleFactor: 1,
    };
    const unitIngredient: RecipeIngredient = {
      uri: IngredientId.make('ingredient'),
      name: 'ingredient',
      amount: O.some(unitIngredientAmount),
      optional: false,
    };

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
