import { Component, Input } from '@angular/core';
import { Recipe } from '@overckd/domain';

@Component({
  selector: 'overckd-recipe-tips',
  templateUrl: './recipe-tips.component.html',
  styleUrls: ['./recipe-tips.component.scss'],
})
export class RecipeTipsComponent {
  @Input() recipe!: Recipe;
}
