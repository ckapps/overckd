import {
  bindEagerlyTo,
  ContextDependency,
  BoundDependency,
} from '@marblejs/core';

import {
  IngredientRepositoryToken,
  TagRepositoryToken,
  RecipeCollectionRepositoryToken,
  RecipeRepositoryToken,
} from '@overckd/domain-rx';

import { AppConfigReader, AppConfigToken } from './config/config.token';
import {
  IngredientFileRepository,
  RecipeFileRespository,
  RecipeCollectionFileRespository,
  TagFileRepository,
} from './repositories';

export const configureDeps = (): BoundDependency<
  unknown,
  ContextDependency
>[] => {
  return [
    // Dependency for the application configuration
    bindEagerlyTo(AppConfigToken)(AppConfigReader),
    // Dependencies for repositories
    bindEagerlyTo(IngredientRepositoryToken)(IngredientFileRepository),
    bindEagerlyTo(RecipeRepositoryToken)(RecipeFileRespository),
    bindEagerlyTo(RecipeCollectionRepositoryToken)(
      RecipeCollectionFileRespository,
    ),
    bindEagerlyTo(TagRepositoryToken)(TagFileRepository),
  ];
};
