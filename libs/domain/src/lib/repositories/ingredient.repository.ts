import { Observable } from 'rxjs';

import {
  Ingredient,
  IngredientQuery,
} from '../models/ingredient/ingredient.model';
import { Page } from '../search';

/**
 * Ingredient repository
 */
export interface IngredientRepository {
  findByQuery(query: IngredientQuery): Observable<Page<Ingredient>>;
}
