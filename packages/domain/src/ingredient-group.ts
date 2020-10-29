import { Ingredient } from './ingredient';

export interface IngredientGroup {
  group: string;
  label: string;
  ingredients: Ingredient[];
}
