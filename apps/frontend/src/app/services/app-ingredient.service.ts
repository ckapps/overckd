import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ingredient, IngredientQuery, Page } from '@overckd/domain';
import { Observable } from 'rxjs';
import { ApiRequestService } from '../modules/domain/api/services/api-request.service';
import { IngredientService } from '../modules/domain/ingredient/modules/ingredient-common/services/ingredient.service';
import { UrlBuilderService } from './url-builder.service';

@Injectable({ providedIn: 'root' })
export class AppIngredientService implements IngredientService {
  constructor(
    private urlBuilder: UrlBuilderService,
    private http: HttpClient,
    private apiRequestService: ApiRequestService,
  ) {}

  findByQuery(query: IngredientQuery): Observable<Page<Ingredient>> {
    const params = this.apiRequestService.createParamsFromQuery(query);

    return this.http.get<Page<Ingredient>>(
      this.urlBuilder.urlFromSegments(['ingredients', `query`]),
      { params },
    );
  }
}
