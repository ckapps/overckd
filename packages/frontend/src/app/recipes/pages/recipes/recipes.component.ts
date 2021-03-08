import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { RecipeCollectionService } from 'src/app/modules/domain/recipe-collection/services/recipe-collection.service';

@Component({
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss'],
})
export class RecipesPageComponent {
  recipeGroups$ = this.recipeCollectionService.collections$;

  constructor(private recipeCollectionService: RecipeCollectionService) {}
}
