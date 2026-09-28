import { Component, input, output } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { CollectionRecipe, RecipeCollection } from '@overckd/domain';

@Component({
  selector: 'overckd-collection-recipe-list',
  templateUrl: './collection-recipe-list.component.html',
  imports: [MatList, MatDivider, MatListItem],
})
export class CollectionRecipeListComponent {
  readonly collection = input.required<RecipeCollection>();

  readonly selected = output<CollectionRecipe>();

  onRecipeClicked(recipe: CollectionRecipe) {
    this.selected.emit(recipe);
  }
}
