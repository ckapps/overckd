import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';

import { RecipeIngredient } from '@overckd/domain';

/**
 * Formats the amount for an ingredient
 */
@Pipe({
  name: 'ingredientAmount',
})
export class IngredientAmountPipe implements PipeTransform {
  /**
   * The format to use for rendering numbers
   */
  private readonly digitFormat = '0.0-2';

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(value: RecipeIngredient, ...args: unknown[]): string {
    const { amount } = value;

    // Nothing to do, if amount isn't a number
    if (typeof amount !== 'number') {
      return amount;
    }

    // Let's see if we can render some fancy fraction
    const fraction = this.getNiceFraction(amount);

    return fraction
      ? this.formatWithFractionSymbol(amount, fraction)
      : formatNumber(amount, this.locale, this.digitFormat);
  }

  private formatWithFractionSymbol(amount: number, fraction: string) {
    const formattedValue = formatNumber(amount, this.locale, '0.2-2');

    const integer = formattedValue.substring(0, formattedValue.length - 3);

    return integer === '0' ? fraction : `${integer}${fraction}`;
  }

  /**
   * Tries to resolve the fraction for the given `value`
   * with a single fraction symbol.
   *
   * @param value THe numeric value
   */
  private getNiceFraction(value: number) {
    // Use 'en' here, so that we are sure about the fraction
    return this.getFraction(formatNumber(value, 'en', '0.0-2'));
  }

  private getFraction(value: string) {
    if (value.endsWith('.25')) {
      return '¼';
    } else if (value.endsWith('.5')) {
      return '½';
    } else if (value.endsWith('.75')) {
      return '¾';
    }

    return undefined;
  }
}
