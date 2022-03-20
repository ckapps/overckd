import {
  bindEagerlyTo,
  BoundDependency,
  ContextDependency,
} from '@marblejs/core';

import {
  IngredientRepositoryToken,
  TagRepositoryToken,
  RecipeCollectionRepositoryToken,
  RecipeRepositoryToken,
} from '@overckd/domain-rx';

import { MockIngredientRespository } from './ingredient.repository';
import { MockRecipeRespository } from './recipe.repository';
import { MockRecipeCollectionRespository } from './recipe-collection.repository';
import { MockTagRespository } from './tag.repository';

export * from './recipe-collection.repository';

/**
 * configures the in-memory dependencies
 */
export function configure(): BoundDependency<any, ContextDependency>[] {
  return [
    bindEagerlyTo(IngredientRepositoryToken)(MockIngredientRespository),
    bindEagerlyTo(RecipeRepositoryToken)(MockRecipeRespository),
    bindEagerlyTo(RecipeCollectionRepositoryToken)(
      MockRecipeCollectionRespository,
    ),
    bindEagerlyTo(TagRepositoryToken)(MockTagRespository),
  ];
}
