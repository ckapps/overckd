import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionRecipe } from '@overckd/domain';
import * as P from 'effect/Predicate';
import { filter, map, switchMap } from 'rxjs';
import { RecipeCollectionComponent } from '../../../../modules/domain/recipe-collection/components/recipe-collection/recipe-collection.component';
import { RecipeCollectionService } from '../../../../modules/domain/recipe-collection/services/recipe-collection.service';

@Component({
  templateUrl: './recipe-collection-page.component.html',
  styleUrls: ['./recipe-collection-page.component.scss'],
  imports: [RecipeCollectionComponent, AsyncPipe],
})
export class RecipeCollectionPageComponent {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #recipeCollectionService = inject(RecipeCollectionService);

  public recipeCollection$ = this.#route.paramMap.pipe(
    map(paramMap => paramMap.get('id')),
    filter(P.isString),
    switchMap(id => this.#recipeCollectionService.getById(id)),
  );

  onRecipeSelected(recipe: CollectionRecipe) {
    this.#router.navigate(['/recipes', 'recipe', recipe.name]);
  }
}
