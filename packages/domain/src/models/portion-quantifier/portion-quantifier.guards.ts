import {
  PortionKind,
  PortionQuantifier,
  LabelPortionQuantifier,
  QuantityPortionQuantifier,
  SpringformPortionQuantifier,
} from './portion-quantifier.model';

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
