import { Component, input } from '@angular/core';

/**
 * The tips of a recipe, as HTML
 */
@Component({
  selector: 'overckd-recipe-tips',
  templateUrl: './recipe-tips.component.html',
  styleUrls: ['./recipe-tips.component.scss'],
  imports: [],
})
export class RecipeTipsComponent {
  readonly tips = input.required<ReadonlyArray<string>>();
}
