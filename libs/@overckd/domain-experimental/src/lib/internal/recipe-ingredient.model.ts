import { Effect, Schema } from 'effect';
import {
  IngredientAmount,
  IngredientAmountJson,
} from './ingredient-amount.model';
import { IngredientId, IngredientIdFromString } from './ingredient.model';

const Alternatives = Schema.Array(Schema.NonEmptyString).pipe(
  Schema.withDecodingDefaultType(Effect.succeed([])),
);

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
    /** Ingredients that can be used instead. */
    alternatives: Alternatives,
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
  /** Ingredients that can be used instead. */
  alternatives: Alternatives,
}).pipe(Schema.decodeTo(RecipeIngredient));

/**
 * @category Models
 */
export type RecipeIngredientGroup = Schema.Schema.Type<
  typeof RecipeIngredientGroup
>;
/**
 * @category Schemas
 */
export const RecipeIngredientGroup = Schema.TaggedStruct(
  'RecipeIngredientGroup',
  {
    /** Name of the group. */
    name: Schema.NonEmptyString,
    /** Label of the group. */
    label: Schema.NonEmptyString,
    /** Ingredients of the group. */
    ingredients: Schema.NonEmptyArray(RecipeIngredient),
  },
).annotate({
  identifier: 'RecipeIngredientGroup',
  title: 'RecipeIngredientGroup',
  description: 'A labeled group of ingredients used in a recipe',
});

/**
 * @category Schemas
 */
export const RecipeIngredientGroupJson = Schema.TaggedStruct(
  'RecipeIngredientGroup',
  {
    /** Name of the group. */
    name: Schema.NonEmptyString,
    /** Label of the group. */
    label: Schema.NonEmptyString,
    /** Ingredients of the group. */
    ingredients: Schema.NonEmptyArray(RecipeIngredientJson),
  },
).pipe(
  // Decode to the type side, so encoding hands the nested `RecipeIngredient`
  // instances to `RecipeIngredientJson` instead of their encoded plain objects.
  Schema.decodeTo(Schema.toType(RecipeIngredientGroup)),
);
