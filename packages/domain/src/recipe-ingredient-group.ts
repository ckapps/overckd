import { RecipeIngredient } from './recipe-ingredient';

export interface RecipeIngredientGroup {
  group: string;
  label: string;
  ingredients: RecipeIngredient[];
}
