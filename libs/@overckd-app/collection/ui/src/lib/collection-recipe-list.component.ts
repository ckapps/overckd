import { Component, input, output } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { Collection, RecipeRef } from '@overckd/domain-experimental';

@Component({
  selector: 'overckd-collection-recipe-list',
  templateUrl: './collection-recipe-list.component.html',
  imports: [MatList, MatDivider, MatListItem],
})
export class CollectionRecipeListComponent {
  readonly collection = input.required<Collection>();

  readonly selected = output<RecipeRef>();

  onRecipeClicked(recipe: RecipeRef) {
    this.selected.emit(recipe);
  }
}
