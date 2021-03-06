import {
  bindEagerlyTo,
  ContextDependency,
  BoundDependency,
} from '@marblejs/core';

import {
  RecipeCollectionRepositoryToken,
  RecipeRepositoryToken,
} from '@overckd/domain-rx';

import { AppConfigReader, AppConfigToken } from './config/config.token';
import {
  RecipeFileRespository,
  RecipeCollectionFileRespository,
} from './repositories';

export const configureDeps = (): BoundDependency<
  unknown,
  ContextDependency
>[] => {
  return [
    // Dependency for the application configuration
    bindEagerlyTo(AppConfigToken)(AppConfigReader),
    // Dependencies for repositories
    bindEagerlyTo(RecipeRepositoryToken)(RecipeFileRespository),
    bindEagerlyTo(RecipeCollectionRepositoryToken)(
      RecipeCollectionFileRespository,
    ),
  ];
};
