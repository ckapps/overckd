export interface RecipeDetailedPreparationStep {
  /**
   * Text for this step
   */
  text?: string;
  /**
   * HTML describing the step
   */
  html?: string;
  /**
   * Array of additional classes
   */
  styles?: string[];
}

export type RecipePreparationStep = RecipeDetailedPreparationStep | string;
