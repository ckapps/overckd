import { Component, computed, input } from '@angular/core';
import { RecipeIngredient, scaleRecipeIngredient } from '@overckd/domain';
import { Option } from 'effect';
import { IngredientAmountPipe } from '../ingredient-amount/ingredient-amount.pipe';

/**
 * Lists the alternatives of an ingredient: "a", "a oder b", "a, b oder c"
 */
const listAlternatives = (alternatives: ReadonlyArray<string>) =>
  alternatives.length === 0
    ? undefined
    : alternatives.reduce((acc, cur, i) => {
        const separator =
          i === 0 ? '' : i + 1 < alternatives.length ? ', ' : ' oder ';

        return `${acc}${separator}${cur}`;
      }, '');

@Component({
  selector: 'overckd-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss'],
  imports: [IngredientAmountPipe],
})
export class IngredientComponent {
  /**
   * The ingredient
   */
  readonly ingredient = input.required<RecipeIngredient>();

  /**
   * Scaling factor for the ingredient amount
   */
  readonly amountScale = input(1);

  /**
   * The ingredient, with its amount scaled
   */
  protected readonly scaled = computed(() =>
    scaleRecipeIngredient(this.ingredient(), this.amountScale()),
  );

  protected readonly amount = computed(() =>
    Option.getOrUndefined(this.scaled().amount),
  );

  protected readonly unit = computed(() => {
    const amount = this.amount();
    return amount?._tag === 'UnitIngredientAmount' ? amount.unit : undefined;
  });

  /**
   * Alternatives for the ingredient
   */
  protected readonly alternatives = computed(() =>
    listAlternatives(this.ingredient().alternatives),
  );
}
