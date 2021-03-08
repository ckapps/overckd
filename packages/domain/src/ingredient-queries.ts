import { IngredientTag } from './ingredient';
import { DataQuery } from './search';

// ==================================================================
// Ingredients
// ==================================================================

export interface IngredientSearch {
  /**
   * Ingredient name
   */
  name?: string;
  /**
   * IDs of ingredient tags
   */
  tags?: IngredientTag['uri'][];
}

export type IngredientQuery = DataQuery<IngredientSearch>;

// ==================================================================
// Ingredient tags
// ==================================================================

export interface IngredientTagSearch {
  /**
   * Tag label
   */
  label?: string;
}

export type IngredientTagQuery = DataQuery<IngredientTagSearch>;
