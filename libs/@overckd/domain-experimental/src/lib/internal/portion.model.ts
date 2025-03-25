import * as Match from 'effect/Match';
import * as Num from 'effect/Number';
import * as O from 'effect/Option';
import * as Schema from 'effect/Schema';
import { OptionNonEmptyString } from './shared.model';

export enum PortionKind {
  Quantity = 'quantity',
  Springform = 'springform',
}

/**
 * Use to describe a portion with a quantity.
 *
 * @category Models
 */
export const QuantityPortion = Schema.Struct({
  kind: Schema.Literal(`${PortionKind.Quantity}`),
  /** Optional label. */
  label: Schema.OptionFromSelf(Schema.NonEmptyString),
  /** Quantity. */
  quantity: Schema.Positive,
});
/**
 * @category Schemas
 */
export const QuantityPortionJson = Schema.Struct({
  kind: Schema.Literal(`${PortionKind.Quantity}`),
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
  kind: Schema.Literal(`${PortionKind.Springform}`),
  /** The diameter in centimeter. */
  diameter: Schema.Positive,
});
/**
 * @category Schemas
 */
export const SpringformPortionJson = SpringformPortion;

/**
 * @category Models
 */
export type Portion = Schema.Schema.Type<typeof Portion>;
export const Portion = Schema.Union(QuantityPortion, SpringformPortion);

/**
 * @category Schemas
 */
export const PortionJson = Schema.Union(
  QuantityPortionJson,
  SpringformPortionJson,
).pipe(Schema.compose(Portion));

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
