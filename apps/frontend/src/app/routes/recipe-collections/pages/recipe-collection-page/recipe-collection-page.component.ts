import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionRecipe } from '@overckd/domain';
import * as P from 'effect/Predicate';
import { filter, map, switchMap } from 'rxjs';
import { RecipeCollectionService } from '../../../../modules/domain/recipe-collection/services/recipe-collection.service';

@Component({
  templateUrl: './recipe-collection-page.component.html',
  styleUrls: ['./recipe-collection-page.component.scss'],
})
export class RecipeCollectionPageComponent {
  public recipeCollection$ = this.route.paramMap.pipe(
    map(paramMap => paramMap.get('id')),
    filter(P.isString),
    switchMap(id => this.recipeCollectionService.getById(id)),
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeCollectionService: RecipeCollectionService,
  ) {}

  onRecipeSelected(recipe: CollectionRecipe) {
    this.router.navigate(['/recipes', 'recipe', recipe.name]);
  }
}
