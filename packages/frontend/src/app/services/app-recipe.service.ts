import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Recipe } from '@overckd/domain';

import { RecipeService } from 'src/domain/recipe/services/recipe.service';
import { UrlBuilderService } from './url-builder.service';

@Injectable()
export class AppRecipeService implements RecipeService {
  constructor(
    private urlBuilder: UrlBuilderService,
    private http: HttpClient,
  ) {}

  get(id) {
    return this.http.get<Recipe>(this.urlBuilder.url(`recipes/${id}`));
  }
}
