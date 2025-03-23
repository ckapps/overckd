import * as Fn from 'effect/Function';
import * as Match from 'effect/Match';
import * as Schema from 'effect/Schema';
import { PositiveInt } from './shared.model';

/**
 * An amount that is measured by the count.
 *
 * @category Models
 */
export const CountIngredientAmount = Schema.Struct({
  _tag: Schema.tag('CountIngredientAmount'),
  /** How much of this ingredient. */
  count: PositiveInt,
  /**
   * Optional scale factor for this ingredient, to control by how much this ingredient
   * scales, when the overall recipe is scaled.
   *
   * Default is `1`.
   */
  scaleFactor: Schema.optionalWith(PositiveInt, {
    default: Fn.constant(1),
  }),
});

/**
 * An Amount that is measured in a unit.
 *
 * @category Models
 */
export const UnitIngredientAmount = Schema.Struct({
  _tag: Schema.tag('UnitIngredientAmount'),
  /** Unit of the amount. */
  unit: Schema.NonEmptyString,
  /** How much of this ingredient. */
  value: Schema.Positive,
  /**
   * Optional scale factor for this ingredient, to control by how much this ingredient
   * scales, when the overall recipe is scaled.
   *
   * Default is `1`.
   */
  scaleFactor: Schema.optionalWith(Schema.Positive, {
    default: Fn.constant(1),
  }),
});

/**
 * An amount that is only described by a label.
 *
 * @category Models
 */
export const LabelIngredientAmount = Schema.Struct({
  _tag: Schema.tag('LabelIngredientAmount'),
  /** A label. */
  label: Schema.NonEmptyString,
});

/**
 * @category Models
 */
export type IngredientAmount = Schema.Schema.Type<typeof IngredientAmount>;
/**
 * @category Schemas
 */
export const IngredientAmount = Schema.Union(
  CountIngredientAmount,
  UnitIngredientAmount,
  LabelIngredientAmount,
);

/**
 * Scales the given `amount` by the given `scalar`.
 *
 * @param amount The ingredient amount to scale
 * @param scalar The scalar by which to scale the ingredient amount
 *
 * @returns
 * Scaled ingredient amount
 */
export const scale: {
  (scalar: number): (amount: IngredientAmount) => IngredientAmount;
  (amount: IngredientAmount, scalar: number): IngredientAmount;
} = Fn.dual(2, (amount: IngredientAmount, scalar: number): IngredientAmount => {
  const transform = _getScaleTransform(scalar);

  return transform(amount);
});

function _getScaleTransform(scalar: number) {
  return Match.type<IngredientAmount>().pipe(
    Match.tags({
      CountIngredientAmount: ({ count, scaleFactor }) =>
        CountIngredientAmount.make({
          count,
          scaleFactor,
        }),
      UnitIngredientAmount: ({ unit, value, scaleFactor }) =>
        UnitIngredientAmount.make({
          unit,
          value: _scale(value, scalar, scaleFactor),
          scaleFactor,
        }),
    }),
    Match.orElse(i => i),
  );
}

function _scale(amount: number, scalar: number, scaleFactor: number): number {
  return amount + amount * (scalar - 1) * scaleFactor;
}
