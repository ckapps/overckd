import { Tag } from '../tag/tag.types';
import { DataQuery } from '../../search';

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
  tags?: Tag['uri'][];
}

export type IngredientQuery = DataQuery<IngredientSearch>;
