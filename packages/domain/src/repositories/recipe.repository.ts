import { Observable } from 'rxjs';

import { Recipe } from '../models/recipe/recipe.model';

/**
 * Interface for a recipe repository.
 */
export interface RecipeRepository {
  /**
   * Get all recipes
   */
  getAll(): Observable<Recipe[]>;

  /**
   * Creates a new recipe
   */
  add(recipe: Recipe): Observable<Recipe>;

  /**
   * Deletes a recipe
   * @param name
   */
  removeByName(name: Recipe['name']): Observable<Recipe>;

  /**
   * Gets a recipe by its name
   * @param name
   */
  getByName(name: Recipe['name']): Observable<Recipe | undefined>;

  /**
   * Update a recipe
   *
   * @param recipe
   * @param name
   */
  update(recipe: Recipe, name: Recipe['name']): Observable<Recipe | undefined>;
}
