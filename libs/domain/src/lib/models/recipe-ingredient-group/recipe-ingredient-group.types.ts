import { RecipeIngredient } from '../recipe-ingredient/recipe-ingredient.model';

export interface RecipeIngredientGroup {
  group: string;
  label: string;
  ingredients: RecipeIngredient[];
}
