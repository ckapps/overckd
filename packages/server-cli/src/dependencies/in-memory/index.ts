import {
  bindEagerlyTo,
  BoundDependency,
  ContextDependency,
} from '@marblejs/core';

import {
  RecipeCollectionRepositoryToken,
  RecipeRepositoryToken,
} from '@overckd/domain-rx';

import { MockRecipeRespository } from './recipe.repository';
import { MockRecipeCollectionRespository } from './recipe-collection.repository';

export * from './recipe-collection.repository';

/**
 * configures the in-memory dependencies
 */
export function configure(): BoundDependency<any, ContextDependency>[] {
  return [
    bindEagerlyTo(RecipeRepositoryToken)(MockRecipeRespository),
    bindEagerlyTo(RecipeCollectionRepositoryToken)(
      MockRecipeCollectionRespository,
    ),
  ];
}
