import { Injectable } from '@angular/core';

import {
  LabelPortionQuantifier,
  PortionKind,
  PortionQuantifier,
  QuantityPortionQuantifier,
  SpringformPortionQuantifier,
  calculateScalingFactor,
  getPortionQuantity,
} from '@overckd/domain/dist/models/portion-quantifier/portion-quantifier.model';

import { scaleIngredientAmount$ } from '@overckd/domain/dist/rxjs/portions';

/**
 * Service for working with and converting portion quantities.
 */
@Injectable({
  providedIn: 'root',
})
export class PortionConverterService {
  constructor() {}

  public scaleIngredientAmount$() {
    return scaleIngredientAmount$();
  }

  public calculateScalingFactor(
    source: PortionQuantifier,
    target: PortionQuantifier,
  ) {
    return calculateScalingFactor(source, target);
  }

  /**
   * Get the scaling factor for the given `quantifier` to reach the
   * given `targetAmount`.
   *
   * @param source Source portion information
   * @param targetAmount The target amount within the same portion information
   */
  public calculateScalingFactorFromSource(
    source: PortionQuantifier,
    targetAmount: number,
  ) {
    const target = this.portionQuantifierFromSource(source, targetAmount);

    return calculateScalingFactor(source, target);
  }

  public getPortionQuantity(quantifier: PortionQuantifier) {
    return getPortionQuantity(quantifier);
  }

  public portionQuantifierFromSource(
    source: PortionQuantifier,
    targetAmount: number,
  ): PortionQuantifier {
    switch (source.kind) {
      case PortionKind.Label:
        return source;
      case PortionKind.Quantity:
        return { ...source, count: targetAmount } as QuantityPortionQuantifier;
      case PortionKind.Springform:
        return {
          ...source,
          diameter: targetAmount,
        } as SpringformPortionQuantifier;
    }
  }
}
