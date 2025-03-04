import { Component, output, input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { CollectionRecipe, RecipeCollection } from '@overckd/domain';

@Component({
  selector: 'overckd-recipe-collection',
  templateUrl: './recipe-collection.component.html',
  styleUrls: ['./recipe-collection.component.scss'],
  imports: [MatList, MatDivider, MatListItem],
})
export class RecipeCollectionComponent {
  readonly recipeCollection = input.required<RecipeCollection>();

  readonly recipeSelected = output<CollectionRecipe>();

  onRecipeClicked(recipe: CollectionRecipe) {
    this.recipeSelected.emit(recipe);
  }
}
