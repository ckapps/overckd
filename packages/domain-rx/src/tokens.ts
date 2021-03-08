import { createContextToken } from '@marblejs/core';

import {
  IngredientRepository,
  IngredientTagRepository,
  RecipeCollectionRepository,
  RecipeRepository,
} from '@overckd/domain/dist/repositories';

const TOKEN_PREFIX = 'overckd-';

// ----------------------------------------------------------------------------
// Repositories - Recipes
// ----------------------------------------------------------------------------
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

/**
 * DI token for ingredient repository
 */
export const IngredientTagRepositoryToken = createContextToken<
  IngredientTagRepository
>(`${TOKEN_PREFIX}IngredientTagRepository`);
