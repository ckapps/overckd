import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CollectionRecipe, RecipeCollection } from '@overckd/domain';

@Component({
  selector: 'overckd-recipe-collection',
  templateUrl: './recipe-collection.component.html',
  styleUrls: ['./recipe-collection.component.scss'],
})
export class RecipeCollectionComponent {
  @Input() recipeCollection!: RecipeCollection;

  @Output() recipeSelected = new EventEmitter<CollectionRecipe>();

  onRecipeClicked(recipe: CollectionRecipe) {
    this.recipeSelected.emit(recipe);
  }
}
