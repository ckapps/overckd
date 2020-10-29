import { Ingredient } from './ingredient';
import { IngredientGroup } from './ingredient-group';
import { BaseRecipe } from './recipe-base';

export type Labeled<T> = T & {
  label: string;
};

export interface Recipe extends BaseRecipe<Ingredient | IngredientGroup> {
  images: string[];

  groups?: Labeled<BaseRecipe<Ingredient>>[];

  // Style visual appearances
  styles: {
    title?: string;
    imagesContainer?: string;
    secondaryImagesContainer?: string;
    images?: string[];
  };
}
