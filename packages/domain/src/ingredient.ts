export interface Ingredient {
  amount?: number | string;
  unit?: string;
  name: string;

  /**
   * Optional scale factor for this ingredient, to control by how much this ingredient
   * scales, when the overall recipe is scaled.
   * Only applies, if `amount` is a `number`.
   *
   * Default is `1`.
   */
  scaleFactor?: number;
  /**
   * Wheter this ingredient can be considered optional.
   */
  optional?: boolean;
  alternatives?: string[];
}
