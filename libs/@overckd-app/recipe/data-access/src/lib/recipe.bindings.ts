import { injectQueries } from '@ckapp/angular-effect';
import { RecipeQueries } from '@overckd/recipe/application';

/** The recipe queries as Angular resources. Call in an injection context. */
export const injectRecipeQueries = () => injectQueries(RecipeQueries);
