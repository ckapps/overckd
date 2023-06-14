import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '@overckd/domain';
import { RecipeService } from '../modules/domain/recipe/services/recipe.service';
import { UrlBuilderService } from './url-builder.service';

@Injectable()
export class AppRecipeService implements RecipeService {
  constructor(
    private urlBuilder: UrlBuilderService,
    private http: HttpClient,
  ) {}

  get(id: Recipe['name']) {
    return this.http.get<Recipe>(this.urlBuilder.url(`recipes/${id}`));
  }
}
