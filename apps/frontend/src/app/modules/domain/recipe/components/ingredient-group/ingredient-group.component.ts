import { Component, input } from '@angular/core';
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
  readonly ingredientGroup = input.required<RecipeIngredientGroup>();
}
