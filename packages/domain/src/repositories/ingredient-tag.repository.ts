import { Observable } from 'rxjs';

import { IngredientTag } from '../ingredient';
import { IngredientTagQuery } from '../ingredient-queries';
import { Page } from '../search';

export interface IngredientTagRepository {
  findByQuery(query: IngredientTagQuery): Observable<Page<IngredientTag>>;
}
