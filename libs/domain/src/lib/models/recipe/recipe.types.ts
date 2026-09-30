import { RecipeIngredient } from '../recipe-ingredient/recipe-ingredient.model';
import { RecipeIngredientGroup } from '../recipe-ingredient-group/recipe-ingredient-group.types';
import { RecipeTimer, TimerId } from '../recipe-timer/recipe-timer.model';

import { BaseRecipe } from './recipe-base.types';

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
