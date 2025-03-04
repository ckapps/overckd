import * as Schema from 'effect/Schema';

/**
 * Describes the kind of the portion
 */
export enum PortionKind {
  Label = 'label',
  Quantity = 'quantity',
  Springform = 'springform',
}

export type LabelPortionQuantifier = typeof LabelPortionQuantifier.Type;
export const LabelPortionQuantifier = Schema.Struct({
  kind: Schema.Literal(PortionKind.Label),
  label: Schema.NonEmptyString,
});

export type QuantityPortionQuantifier = typeof QuantityPortionQuantifier.Type;
export const QuantityPortionQuantifier = Schema.Struct({
  kind: Schema.Literal(PortionKind.Quantity),
  count: Schema.Number,
  label: Schema.optional(Schema.NonEmptyString),
});

export type SpringformPortionQuantifier =
  typeof SpringformPortionQuantifier.Type;
export const SpringformPortionQuantifier = Schema.Struct({
  kind: Schema.Literal(PortionKind.Springform),
  /** The diameter in centimeter. */
  diameter: Schema.Number,
});

export type PortionQuantifier = typeof PortionQuantifier.Type;
export const PortionQuantifier = Schema.Union(
  LabelPortionQuantifier,
  QuantityPortionQuantifier,
  SpringformPortionQuantifier,
);

/**
 * Checks if `q` is a `LabelPortionQuantifier`
 * @param q
 */
export function isLabelPortionQuantifier(
  q: PortionQuantifier,
): q is LabelPortionQuantifier {
  return q.kind === PortionKind.Label;
}

/**
 * Checks if `q` is a `QuantityPortionQuantifier`
 * @param q
 */
export function isQuantityPortionQuantifier(
  q: PortionQuantifier,
): q is QuantityPortionQuantifier {
  return q.kind === PortionKind.Quantity;
}

/**
 * Checks if `q` is a `SpringformPortionQuantifier`
 * @param q
 */
export function isSpringformPortionQuantifier(
  q: PortionQuantifier,
): q is SpringformPortionQuantifier {
  return q.kind === PortionKind.Springform;
}

/**
 * Extracts the portion quantity information from the given `quantifier`.
 *
 * @param quantifier Quantifier information
 */
export function getPortionQuantity(quantifier: PortionQuantifier): number {
  if (isLabelPortionQuantifier(quantifier)) {
    return 1;
  } else if (isQuantityPortionQuantifier(quantifier)) {
    return quantifier.count;
  } else if (isSpringformPortionQuantifier(quantifier)) {
    return quantifier.diameter;
  }

  return Number.NaN;
}

/**
 * Calculates the scaling factor from a given `source` portion
 * that is needed to reach the given `target` portion.
 *
 * @param source Source quantifier information
 * @param target target quantifier information
 */
export function calculateScalingFactor(
  source: PortionQuantifier,
  target: PortionQuantifier,
): number {
  const sourceValue = getPortionQuantity(source);
  const targetValue = getPortionQuantity(target);

  return targetValue / sourceValue;
}
