import { Component, input } from '@angular/core';

/**
 * A labeled group of ingredients, given as an `overckd-ingredient-list`
 */
@Component({
  selector: 'overckd-ingredient-group',
  templateUrl: './ingredient-group.component.html',
  styleUrls: ['./ingredient-group.component.scss'],
})
export class IngredientGroupComponent {
  /**
   * The label of the group
   */
  readonly label = input.required<string>();
}
