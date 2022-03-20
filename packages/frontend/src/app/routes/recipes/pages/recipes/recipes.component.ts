import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CollectionRecipe } from '@overckd/domain';

import { RecipeCollectionService } from 'src/app/modules/domain/recipe-collection/services/recipe-collection.service';

@Component({
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
export class RecipesPageComponent {
  recipeGroups$ = this.recipeCollectionService.collections$;

  constructor(
    private router: Router,
    private recipeCollectionService: RecipeCollectionService,
  ) {}

  onRecipeSelected(recipe: CollectionRecipe) {
    this.router.navigate(['/recipes', 'recipe', recipe.name]);
  }
}
