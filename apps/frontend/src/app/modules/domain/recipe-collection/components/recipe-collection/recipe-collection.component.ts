import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CollectionRecipe, RecipeCollection } from '@overckd/domain';

@Component({
  selector: 'overckd-recipe-collection',
  templateUrl: './recipe-collection.component.html',
  styleUrls: ['./recipe-collection.component.scss'],
})
export class RecipeCollectionComponent implements OnInit {
  @Input() recipeCollection!: RecipeCollection;

  @Output() recipeSelected = new EventEmitter<CollectionRecipe>();

  constructor() {}

  ngOnInit(): void {}

  onRecipeClicked(recipe: CollectionRecipe) {
    this.recipeSelected.emit(recipe);
  }
}
