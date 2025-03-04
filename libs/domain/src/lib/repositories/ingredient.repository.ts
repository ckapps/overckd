import { Observable } from 'rxjs';
import { Ingredient } from '../ingredient';
import { IngredientQuery } from '../models/ingredient.queries';
import { Page } from '../search';

/**
 * Ingredient repository
 */
export interface IngredientRepository {
  findByQuery(query: IngredientQuery): Observable<Page<Ingredient>>;
}
