import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { RecipeCollection } from '@overckd/domain';

import { RecipeCollectionService } from 'src/domain/recipe/services/recipe-collection.service';
import { UrlBuilderService } from './url-builder.service';

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
