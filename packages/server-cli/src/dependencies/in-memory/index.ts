import {
  bindEagerlyTo,
  BoundDependency,
  ContextDependency,
} from '@marblejs/core';

import {
  IngredientRepositoryToken,
  IngredientTagRepositoryToken,
  RecipeCollectionRepositoryToken,
  RecipeRepositoryToken,
} from '@overckd/domain-rx';

import { MockIngredientRespository } from './ingredient.repository';
import { MockIngredientTagRespository } from './ingredient-tag.repository';
import { MockRecipeRespository } from './recipe.repository';
import { MockRecipeCollectionRespository } from './recipe-collection.repository';

export * from './recipe-collection.repository';

/**
 * configures the in-memory dependencies
 */
export function configure(): BoundDependency<any, ContextDependency>[] {
  return [
    bindEagerlyTo(IngredientRepositoryToken)(MockIngredientRespository),
    bindEagerlyTo(IngredientTagRepositoryToken)(MockIngredientTagRespository),
    bindEagerlyTo(RecipeRepositoryToken)(MockRecipeRespository),
    bindEagerlyTo(RecipeCollectionRepositoryToken)(
      MockRecipeCollectionRespository,
    ),
  ];
}
