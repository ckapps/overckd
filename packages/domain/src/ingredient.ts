import { Tag } from './tag';

export interface BaseIngredient {
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
export interface Ingredient extends BaseIngredient {
  tags: Tag[];
}

export type IngredientTag = Tag;
