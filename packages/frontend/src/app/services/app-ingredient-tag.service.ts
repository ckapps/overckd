import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IngredientTag, IngredientTagQuery } from '@overckd/domain';
import { Page } from '@overckd/domain/dist/search';

import { UrlBuilderService } from './url-builder.service';
import { IngredientTagService } from '../modules/domain/ingredient/modules/ingredient-common/services/ingredient-tag.service';

@Injectable({ providedIn: 'root' })
export class AppIngredientTagService implements IngredientTagService {
  constructor(
    private urlBuilder: UrlBuilderService,
    private http: HttpClient,
  ) {}

  findByQuery(query: IngredientTagQuery): Observable<Page<IngredientTag>> {
    const { page, size, query: otherParams } = query;
    const params: Record<string, string | string[]> = { ...otherParams };

    if (page !== null && page !== undefined) {
      params['page'] = `${page}`;
    }
    if (size !== null && size !== undefined) {
      params['size'] = `${size}`;
    }

    console.log('looking for tags', params);

    return this.http.get<Page<IngredientTag>>(
      this.urlBuilder.urlFromSegments(['ingredients', 'tags', `query`]),
      params,
    );
  }
}
