import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RecipeCollection } from '@overckd/domain';

import { UrlBuilderService } from './url-builder.service';
import { RecipeCollectionService } from '../modules/domain/recipe/services/recipe-collection.service';

@Injectable()
export class AppRecipeCollectionService implements RecipeCollectionService {
  constructor(
    private urlBuilder: UrlBuilderService,
    private http: HttpClient,
  ) {}

  list(): Observable<RecipeCollection[]> {
    return this.http.get<RecipeCollection[]>(
      this.urlBuilder.url('collections'),
    );
  }
}
