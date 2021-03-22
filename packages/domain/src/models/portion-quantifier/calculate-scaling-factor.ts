import { PortionQuantifier } from './portion-quantifier.model';
import { getPortionQuantity } from './get-portion-quantity';

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
