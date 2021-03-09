import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IngredientTag, IngredientTagQuery } from '@overckd/domain';
import { Page } from '@overckd/domain/dist/search';

import { UrlBuilderService } from './url-builder.service';
import { IngredientTagService } from '../modules/domain/ingredient/modules/ingredient-common/services/ingredient-tag.service';
import { ApiRequestService } from '../modules/domain/api/services/api-request.service';

@Injectable({ providedIn: 'root' })
export class AppIngredientTagService implements IngredientTagService {
  constructor(
    private urlBuilder: UrlBuilderService,
    private http: HttpClient,
    private apiRequestService: ApiRequestService,
  ) {}

  findByQuery(query: IngredientTagQuery): Observable<Page<IngredientTag>> {
    const params = this.apiRequestService.createParamsFromQuery(query);

    return this.http.get<Page<IngredientTag>>(
      this.urlBuilder.urlFromSegments(['ingredients', 'tags', `query`]),
      { params },
    );
  }
}
