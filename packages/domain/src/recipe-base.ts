import { PortionQuantifier } from './portion-quantifier';
import { RecipePreparationStep } from './recipe-preparation-step';

export interface BaseRecipe<TIngredient> {
  /**
   * Name of the recipe
   */
  name: string;
  /**
   * On what the recipe is based on (sources)
   */
  basedOn?: string[];
  /**
   * An indicator for how many portions/plates the amounts in the recipe are
   */
  portion?: PortionQuantifier;
  /**
   * The ingredients
   */
  ingredients: TIngredient[];
  /**
   * The steps of preparation
   */
  steps: RecipePreparationStep[];
  /**
   * A list of tips
   */
  tips: string[];

  // Style visual appearances
  stepsEnumerated?: boolean;
}
