import * as Fn from 'effect/Function';
import * as Schema from 'effect/Schema';
import {
  IngredientAmount,
  IngredientAmountJson,
} from './ingredient-amount.model';
import { IngredientId, IngredientIdFromString } from './ingredient.model';

/**
 * @category Models
 */
export class RecipeIngredient extends Schema.Class<RecipeIngredient>(
  '@overckd/RecipeIngredient',
)(
  {
    /** ingredient URI. */
    uri: IngredientId,
    /** the name of the ingredient. */
    name: Schema.NonEmptyString,
    /** How much of this ingredient. */
    amount: Schema.OptionFromSelf(IngredientAmount),
    /**
     * Wheter this ingredient can be considered optional.
     */
    optional: Schema.optionalWith(Schema.Boolean, {
      default: Fn.constFalse,
    }),
  },
  {
    identifier: 'RecipeIngredient',
    title: 'RecipeIngredient',
    description: 'An ingredient used in a recipe',
  },
) {}

/**
 * @category instances
 */
export const Equivalence = Schema.equivalence(RecipeIngredient);

/**
 * @category Schemas
 */
export const RecipeIngredientJson = Schema.Struct({
  /** ingredient URI. */
  uri: IngredientIdFromString,
  /** the name of the ingredient. */
  name: Schema.NonEmptyString,
  /** How much of this ingredient. */
  amount: Schema.optionalWith(IngredientAmountJson, {
    as: 'Option',
  }),
  /**
   * Wheter this ingredient can be considered optional.
   */
  optional: Schema.optionalWith(Schema.Boolean, {
    default: Fn.constFalse,
  }),
}).pipe(Schema.compose(RecipeIngredient));
