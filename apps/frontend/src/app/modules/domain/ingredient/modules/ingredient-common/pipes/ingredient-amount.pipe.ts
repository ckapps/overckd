import { formatNumber } from '@angular/common';
import { LOCALE_ID, Pipe, PipeTransform, inject } from '@angular/core';
import { IngredientAmount } from '@overckd/domain-experimental';
import { Match } from 'effect';

/**
 * Formats the amount of an ingredient, without its unit
 */
@Pipe({ name: 'ingredientAmount' })
export class IngredientAmountPipe implements PipeTransform {
  readonly #locale = inject(LOCALE_ID);

  /**
   * The format to use for rendering numbers
   */
  private readonly digitFormat = '0.0-2';

  transform(amount: IngredientAmount): string {
    return Match.value(amount).pipe(
      Match.tagsExhaustive({
        CountIngredientAmount: ({ count }) => this.formatValue(count),
        FractionIngredientAmount: ({ value }) => this.formatValue(value),
        UnitIngredientAmount: ({ value }) => this.formatValue(value),
        LabelIngredientAmount: ({ label }) => label,
      }),
    );
  }

  private formatValue(value: number) {
    // Let's see if we can render some fancy fraction
    const fraction = this.getNiceFraction(value);

    return fraction
      ? this.formatWithFractionSymbol(value, fraction)
      : formatNumber(value, this.#locale, this.digitFormat);
  }

  private formatWithFractionSymbol(value: number, fraction: string) {
    const formattedValue = formatNumber(value, this.#locale, '0.2-2');

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
