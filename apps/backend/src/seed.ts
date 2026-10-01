import {
  Collection,
  CollectionId,
  IngredientId,
  NonEmptyHtmlString,
  Portion,
  RecipeId,
  RecipeIngredient,
  RecipePreparation,
  RecipeRef,
  UnitIngredientAmount,
} from '@overckd/domain-experimental';
import { Option } from 'effect';

// Stub data the backend serves until it has real storage.

const unitIngredientAmount = UnitIngredientAmount.make({
  value: 1,
  unit: 'g',
  scaleFactor: 1,
});

const quantityPortion = Portion.QuantityPortion.make({
  kind: 'quantity',
  label: Option.none(),
  quantity: 1,
});

const recipe = RecipePreparation.make({
  // for now, keep id and name the same
  id: RecipeId.make('my-recipe'),
  name: 'my-recipe',
  tips: [],
  basedOn: [],
  ingredients: [
    RecipeIngredient.make({
      uri: IngredientId.make('ingredient'),
      name: 'ingredient',
      amount: Option.some(unitIngredientAmount),
      optional: false,
      alternatives: [],
    }),
  ],
  portion: quantityPortion,
  steps: [
    { instruction: NonEmptyHtmlString.make('Step 1') },
    { instruction: NonEmptyHtmlString.make('Step 2') },
  ],
  stepsEnumerated: false,
  images: [],
});

export const recipes: ReadonlyArray<RecipePreparation> = [recipe];

export const collections: ReadonlyArray<Collection> = [
  Collection.make({
    id: CollectionId.make('1'),
    name: 'Test',
    description: 'Test description',
    recipes: recipes.map(r => RecipeRef.make(r)),
  }),
];
