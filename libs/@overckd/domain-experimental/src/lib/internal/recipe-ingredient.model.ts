import { Effect, Schema } from 'effect';
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
    amount: Schema.Option(IngredientAmount),
    /**
     * Wheter this ingredient can be considered optional.
     */
    optional: Schema.Boolean.pipe(
      Schema.withDecodingDefaultType(Effect.succeed(false)),
    ),
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
export const Equivalence = Schema.toEquivalence(RecipeIngredient);

/**
 * @category Schemas
 */
export const RecipeIngredientJson = Schema.Struct({
  /** ingredient URI. */
  uri: IngredientIdFromString,
  /** the name of the ingredient. */
  name: Schema.NonEmptyString,
  /** How much of this ingredient. */
  amount: Schema.OptionFromOptional(IngredientAmountJson),
  /**
   * Wheter this ingredient can be considered optional.
   */
  optional: Schema.Boolean.pipe(
    Schema.withDecodingDefaultType(Effect.succeed(false)),
  ),
}).pipe(Schema.decodeTo(RecipeIngredient));
