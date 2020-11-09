import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { RecipeCollection } from '@overckd/domain';

import { AppRecipeService } from 'src/app/services/app-recipe.service';
import { RecipeService } from 'src/app/modules/domain/recipe/services/recipe.service';
import { RecipeCollectionService } from 'src/app/modules/domain/recipe/services/recipe-collection.service';

@Component({
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],

  providers: [
    {
      provide: RecipeService,
      useClass: AppRecipeService,
    },
  ],
})
export class RecipesPageComponent implements OnInit {
  recipeGroups$: Observable<RecipeCollection[]>;

  constructor(private recipeCollectionService: RecipeCollectionService) {}

  ngOnInit() {
    this.recipeGroups$ = this.recipeCollectionService.list();
  }
}
