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
   * Creates a new recipe collection
   */
  add(collection: RecipeCollection): Observable<RecipeCollection>;

  /**
   * Deletes a recipe collection using the `id`.
   *
   * @param id ID of the collection to remove
   */
  removeById(id: RecipeCollection['id']): Observable<RecipeCollection>;

  /**
   * Gets a recipe by its `id`
   *
   * @param id
   */
  getById(id: RecipeCollection['id']): Observable<RecipeCollection | undefined>;

  /**
   * Update a recipe collection
   *
   * @param collection
   * @param id
   */
  update(
    collection: RecipeCollection,
    id: RecipeCollection['id'],
  ): Observable<RecipeCollection | undefined>;
}
