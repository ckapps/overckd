import { TimerId } from '../recipe-timer/recipe-timer.model';

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
  timers?: {
    /**
     * IDs of timers that start with this step
     */
    start?: TimerId[];
    /**
     * IDs of timers which must be completed before starting this step
     */
    await?: TimerId[];
  };
}

export type RecipePreparationStep = RecipeDetailedPreparationStep | string;
