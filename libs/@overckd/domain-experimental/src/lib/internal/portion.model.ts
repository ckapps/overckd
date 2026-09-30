import { Match, Number as Num, Option as O, Schema } from 'effect';
import { OptionNonEmptyString, Positive } from './shared.model';

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
  label: Schema.Option(Schema.NonEmptyString),
  /** Quantity. */
  quantity: Positive,
});
/**
 * @category Schemas
 */
export const QuantityPortionJson = Schema.Struct({
  kind: Schema.Literal(`${PortionKind.Quantity}`),
  /** Optional label. */
  label: OptionNonEmptyString,
  /** Quantity. */
  quantity: Positive,
});

/**
 * Use to describe a portion in a springform.
 *
 * @category Models
 */
export const SpringformPortion = Schema.Struct({
  kind: Schema.Literal(`${PortionKind.Springform}`),
  /** The diameter in centimeter. */
  diameter: Positive,
});
/**
 * @category Schemas
 */
export const SpringformPortionJson = SpringformPortion;

/**
 * @category Models
 */
export type Portion = Schema.Schema.Type<typeof Portion>;
export const Portion = Schema.Union([QuantityPortion, SpringformPortion]);

/**
 * @category Schemas
 */
export const PortionJson = Schema.Union([
  QuantityPortionJson,
  SpringformPortionJson,
]).pipe(Schema.decodeTo(Portion));

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
