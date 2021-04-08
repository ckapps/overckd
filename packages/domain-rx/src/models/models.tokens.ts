// ----------------------------------------------------------------------------
// Repositories - Recipes
// ----------------------------------------------------------------------------

import { createContextToken } from '@marblejs/core';
import {
  RecipeCollectionRepository,
  RecipeRepository,
  IngredientRepository,
  TagRepository,
} from '@overckd/domain/dist/repositories';

const TOKEN_PREFIX = 'overckd-';

/**
 * DI token for recipe collection repository
 */
export const RecipeCollectionRepositoryToken = createContextToken<
  RecipeCollectionRepository
>(`${TOKEN_PREFIX}RecipeCollectionRepo`);

/**
 * DI token for recipe collection repository
 */
export const RecipeRepositoryToken = createContextToken<RecipeRepository>(
  `${TOKEN_PREFIX}RecipeRepo`,
);

// ----------------------------------------------------------------------------
// Repositories - Ingredients
// ----------------------------------------------------------------------------
/**
 * DI token for ingredient repository
 */
export const IngredientRepositoryToken = createContextToken<
  IngredientRepository
>(`${TOKEN_PREFIX}IngredientRepository`);

// ----------------------------------------------------------------------------
// Repositories - Tags
// ----------------------------------------------------------------------------
/**
 * DI token for tag repository
 */
export const TagRepositoryToken = createContextToken<TagRepository>(
  `${TOKEN_PREFIX}TagRepositoryToken`,
);
