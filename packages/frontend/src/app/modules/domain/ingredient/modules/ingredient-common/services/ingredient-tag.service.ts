import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { IngredientTag, IngredientTagQuery } from '@overckd/domain';
import { Page } from '@overckd/domain/dist/search';

@Injectable()
export abstract class IngredientTagService {
  abstract findByQuery(
    query: IngredientTagQuery,
  ): Observable<Page<IngredientTag>>;
}
