import { Recipe } from '../recipe';

/**
 * Interface for a recipe repository.
 */
export interface RecipeRepository {
  /**
   * Get all recipes
   */
  getAll(): Promise<Recipe[]>;

  /**
   * Creates a new recipe
   */
  add(recipe: Recipe): Promise<Recipe>;

  /**
   * Deletes a recipe
   * @param name
   */
  removeByName(name: Recipe['name']): Promise<boolean>;

  /**
   * Gets a recipe by its name
   * @param name
   */
  getByName(name: Recipe['name']): Promise<Recipe | undefined>;

  /**
   * Update a recipe
   *
   * @param recipe
   * @param name
   */
  update(recipe: Recipe, name: Recipe['name']): Promise<Recipe>;
}
