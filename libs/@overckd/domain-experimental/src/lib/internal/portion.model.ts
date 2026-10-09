import { Match, Option as O, Schema } from 'effect';
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
 * The kinds of portions, in the order to offer them.
 */
export const kinds: ReadonlyArray<PortionKind> = [
  PortionKind.Quantity,
  PortionKind.Springform,
];

/**
 * The number a portion is measured by: its quantity, or the diameter of a
 * springform.
 *
 * @param portion Portion descriptor
 */
export const getQuantity: (portion: Portion) => number =
  Match.type<Portion>().pipe(
    Match.discriminatorsExhaustive('kind')({
      quantity: ({ quantity }) => quantity,
      springform: ({ diameter }) => diameter,
    }),
  );

/**
 * The given `portion` with `quantity` in place of its quantity, or of the
 * diameter of a springform.
 *
 * @returns
 * The new portion, or none if `quantity` isn't positive.
 */
export const withQuantity = (
  portion: Portion,
  quantity: number,
): O.Option<Portion> =>
  Match.value(portion).pipe(
    Match.discriminatorsExhaustive('kind')({
      quantity: portion => QuantityPortion.makeOption({ ...portion, quantity }),
      springform: portion =>
        SpringformPortion.makeOption({ ...portion, diameter: quantity }),
    }),
  );

/**
 * @returns
 * The factor by which the source portion needs to be scaled to reach the target portion.
 */
export const scaleFactor = (source: Portion, target: Portion): number =>
  getQuantity(target) / getQuantity(source);

/**
 * @returns
 * The factor by which the `source` portion needs to be scaled to reach
 * `quantity` (see `withQuantity`), or none if `quantity` isn't positive.
 */
export const scaleFactorTo = (
  source: Portion,
  quantity: number,
): O.Option<number> =>
  O.map(withQuantity(source, quantity), target => scaleFactor(source, target));
