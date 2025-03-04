import { DataQuery } from '../search';
import * as Uri from '../uri';

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
  tags?: Uri.Uri[];
}

export type IngredientQuery = DataQuery<IngredientSearch>;
