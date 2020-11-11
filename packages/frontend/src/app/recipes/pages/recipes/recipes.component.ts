import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { RecipeCollection } from '@overckd/domain';

import { RecipeCollectionService } from 'src/app/modules/domain/recipe-collection/services/recipe-collection.service';

@Component({
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
export class RecipesPageComponent implements OnInit {
  recipeGroups$: Observable<RecipeCollection[]>;

  constructor(private recipeCollectionService: RecipeCollectionService) {}

  ngOnInit() {
    this.recipeGroups$ = this.recipeCollectionService.getAll();
  }
}
