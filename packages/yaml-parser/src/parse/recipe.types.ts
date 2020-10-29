import { Recipe } from '@overckd/domain';

export interface YamlRecipeFile {
  overckd: string;
  recipe: Recipe;
}
