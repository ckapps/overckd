import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CollectionRecipe } from '@overckd/domain';
import { RecipeCollectionComponent } from '../../../../modules/domain/recipe-collection/components/recipe-collection/recipe-collection.component';
import { RecipeCollectionService } from '../../../../modules/domain/recipe-collection/services/recipe-collection.service';

@Component({
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
  imports: [RecipeCollectionComponent, AsyncPipe],
})
export class RecipesPageComponent {
  readonly #router = inject(Router);
  readonly #recipeCollectionService = inject(RecipeCollectionService);

  recipeGroups$ = this.#recipeCollectionService.collections$;

  onRecipeSelected(recipe: CollectionRecipe) {
    this.#router.navigate(['/recipes', 'recipe', recipe.name]);
  }
}
