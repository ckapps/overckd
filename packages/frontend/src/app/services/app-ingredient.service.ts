import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Ingredient, IngredientQuery } from '@overckd/domain';

import { UrlBuilderService } from './url-builder.service';
import { IngredientService } from '../modules/domain/ingredient/modules/ingredient-common/services/ingredient.service';
import { Page } from '@overckd/domain/dist/search';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppIngredientService implements IngredientService {
  constructor(
    private urlBuilder: UrlBuilderService,
    private http: HttpClient,
  ) {}

  findByQuery(query: IngredientQuery): Observable<Page<Ingredient>> {
    const { page, size, query: otherParams } = query;
    const params: Record<string, string | string[]> = { ...otherParams };

    if (page !== null && page !== undefined) {
      params['page'] = `${page}`;
    }
    if (size !== null && size !== undefined) {
      params['size'] = `${size}`;
    }

    return this.http.get<Page<Ingredient>>(
      this.urlBuilder.url(`ingredients/query`),
      params,
    );
  }
}
