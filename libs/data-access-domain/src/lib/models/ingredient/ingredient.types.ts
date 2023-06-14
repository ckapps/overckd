import { Tag } from '../tag/tag.types';

export interface IngredientBase {
  /**
   * URI identifying this ingredient
   */
  uri?: string;
  /**
   * Name of the ingredient
   */
  name: string;
}

/**
 * Ingredient
 */
export interface Ingredient extends IngredientBase {
  tags: Tag[];
}
