import { PortionQuantifier } from '../portion-quantifier';
import {
  isLabelPortionQuantifier,
  isQuantityPortionQuantifier,
  isSpringformPortionQuantifier,
} from './portion-quantifier.guards';

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
