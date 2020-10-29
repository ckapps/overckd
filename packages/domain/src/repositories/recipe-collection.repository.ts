import { RecipeCollection } from '../recipe-collection';

/**
 * Interface for a recipe collection repository.
 */
export interface RecipeCollectionRepository {
  /**
   * Get all recipe collections
   */
  getAll(): Promise<RecipeCollection[]>;

  /**
   * Creates a new recipe collection
   */
  add(collection: RecipeCollection): Promise<RecipeCollection>;

  /**
   * Deletes a recipe collection using the `id`.
   *
   * @param id ID of the collection to remove
   */
  removeById(id: RecipeCollection['id']): Promise<boolean>;

  /**
   * Gets a recipe by its `id`
   *
   * @param id
   */
  getById(id: RecipeCollection['id']): Promise<RecipeCollection | undefined>;

  /**
   * Update a recipe collection
   *
   * @param collection
   * @param id
   */
  update(
    collection: RecipeCollection,
    id: RecipeCollection['id'],
  ): Promise<RecipeCollection>;
}
