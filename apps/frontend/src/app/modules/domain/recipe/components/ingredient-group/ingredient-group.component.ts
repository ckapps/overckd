import { Component, Input } from '@angular/core';
import { RecipeIngredientGroup } from '@overckd/domain';

@Component({
  selector: 'overckd-ingredient-group',
  templateUrl: './ingredient-group.component.html',
  styleUrls: ['./ingredient-group.component.scss'],
})
export class IngredientGroupComponent {
  /**
   * The ingredient group to display
   */
  @Input() ingredientGroup!: RecipeIngredientGroup;

  /**
   * Scaling factor for the ingredient amount
   */
  @Input() amountScale = 1;
}
