import { Component, input } from '@angular/core';
import { Recipe } from '@overckd/domain';

@Component({
  selector: 'overckd-recipe-tips',
  templateUrl: './recipe-tips.component.html',
  styleUrls: ['./recipe-tips.component.scss'],
  imports: [],
})
export class RecipeTipsComponent {
  readonly recipe = input.required<Recipe>();
}
