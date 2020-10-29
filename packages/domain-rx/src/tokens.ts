import { createContextToken } from '@marblejs/core';

import {
  RecipeCollectionRepository,
  RecipeRepository,
} from '@overckd/domain/dist/repositories';

// ----------------------------------------------------------------------------
// Repositories
// ----------------------------------------------------------------------------
/**
 * DI token for recipe collection repository
 */
export const RecipeCollectionRepositoryToken = createContextToken<
  RecipeCollectionRepository
>('RecipeCollectionRepo');

/**
 * DI token for recipe collection repository
 */
export const RecipeRepositoryToken = createContextToken<RecipeRepository>(
  'RecipeRepo',
);
