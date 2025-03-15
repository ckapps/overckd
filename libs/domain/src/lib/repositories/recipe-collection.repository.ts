import { Observable } from 'rxjs';

import { RecipeCollection } from '../models/recipe-collection/recipe-collection.model';

/**
 * Interface for a recipe collection repository.
 */
export interface RecipeCollectionRepository {
  /**
   * Get all recipe collections
   */
  getAll(): Observable<RecipeCollection[]>;

  /**
   * Gets a recipe by its `id`
   *
   * @param id
   */
  getById(id: RecipeCollection['id']): Observable<RecipeCollection | undefined>;
}
