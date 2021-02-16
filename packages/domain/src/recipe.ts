import { RecipeIngredient } from './recipe-ingredient';
import { RecipeIngredientGroup } from './recipe-ingredient-group';
import { BaseRecipe } from './recipe-base';
import { RecipeTimer, TimerId } from './recipe-timer';

export type Labeled<T> = T & {
  label: string;
};

export interface Recipe
  extends BaseRecipe<RecipeIngredient | RecipeIngredientGroup> {
  images: string[];

  groups?: Labeled<BaseRecipe<RecipeIngredient>>[];

  /**
   * Timers for this recipe
   */
  timers?: Record<TimerId, RecipeTimer>;

  // Style visual appearances
  styles: {
    title?: string;
    imagesContainer?: string;
    secondaryImagesContainer?: string;
    images?: string[];
  };
}
