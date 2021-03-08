import { Observable } from 'rxjs';

import { Ingredient, IngredientQuery } from '@overckd/domain';
import { Page } from '@overckd/domain/dist/search';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class IngredientService {
  abstract findByQuery(query: IngredientQuery): Observable<Page<Ingredient>>;
}
