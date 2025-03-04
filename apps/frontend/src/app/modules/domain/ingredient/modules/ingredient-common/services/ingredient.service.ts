import { Injectable } from '@angular/core';
import { Ingredient, IngredientQuery, Page } from '@overckd/domain';
import { Observable } from 'rxjs';

@Injectable()
export abstract class IngredientService {
  abstract findByQuery(query: IngredientQuery): Observable<Page<Ingredient>>;
}
