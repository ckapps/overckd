import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CollectionRecipe, RecipeCollection } from '@overckd/domain';

import { RecipeCollectionService } from 'src/app/modules/domain/recipe-collection/services/recipe-collection.service';

@Component({
  templateUrl: './recipe-collection-page.component.html',
  styleUrls: ['./recipe-collection-page.component.scss'],
})
export class RecipeCollectionPageComponent implements OnInit {
  public recipeCollection$: Observable<RecipeCollection>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeCollectionService: RecipeCollectionService,
  ) {}

  ngOnInit() {
    this.recipeCollection$ = this.route.paramMap.pipe(
      switchMap(paramMap =>
        this.recipeCollectionService.getById(paramMap.get('id')),
      ),
    );
  }

  onRecipeSelected(recipe: CollectionRecipe) {
    this.router.navigate(['/recipes', 'recipe', recipe.name]);
  }
}
