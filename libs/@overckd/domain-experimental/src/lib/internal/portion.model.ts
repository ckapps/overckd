import * as Match from 'effect/Match';
import * as Num from 'effect/Number';
import * as O from 'effect/Option';
import * as Schema from 'effect/Schema';
import { OptionNonEmptyString } from './shared.model';

export enum PortionKind {
  Label = 'label',
  Quantity = 'quantity',
  Springform = 'springform',
}

/**
 * Use as a general description of a portion.
 *
 * @category Models
 */
export const LabelPortion = Schema.Struct({
  /** Label */
  label: Schema.NonEmptyString,
});

/**
 * Use to describe a portion with a quantity.
 *
 * @category Models
 */
export const QuantityPortion = Schema.Struct({
  /** Optional label. */
  label: OptionNonEmptyString,
  /** Quantity. */
  quantity: Schema.Positive,
});

/**
 * Use to describe a portion in a springform.
 *
 * @category Models
 */
export const SpringformPortion = Schema.Struct({
  /** The diameter in centimeter. */
  diameter: Schema.Positive,
});

/**
 * @category Models
 */
export type Portion = Schema.Schema.Type<typeof Portion>;
export const Portion = Schema.Union(
  LabelPortion.pipe(
    Schema.attachPropertySignature('kind', `${PortionKind.Label}`),
  ),
  QuantityPortion.pipe(
    Schema.attachPropertySignature('kind', `${PortionKind.Quantity}`),
  ),
  SpringformPortion.pipe(
    Schema.attachPropertySignature('kind', `${PortionKind.Springform}`),
  ),
);

/**
 * Extracts the portion quantity information from the given `portion`.
 *
 * @param portion Portion descriptor
 */
export function getQuantity(portion: Portion): O.Option<number> {
  return Match.value(portion).pipe(
    Match.when({ kind: PortionKind.Quantity }, ({ quantity }) => quantity),
    Match.when({ kind: PortionKind.Springform }, ({ diameter }) => diameter),
    Match.option,
  );
}

/**
 * @returns
 * The factor by which the source portion needs to be scaled to reach the target portion.
 */
export function scaleFactor<T extends Portion>(
  source: T,
  target: T,
): O.Option<number> {
  return O.all({
    sourceValue: getQuantity(source),
    targetValue: getQuantity(target),
  }).pipe(
    O.flatMap(({ sourceValue, targetValue }) =>
      Num.divide(targetValue, sourceValue),
    ),
  );
}
