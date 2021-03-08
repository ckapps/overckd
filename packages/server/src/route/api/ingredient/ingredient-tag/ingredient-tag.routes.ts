import { combineRoutes } from '@marblejs/core';

import { findIngredientTagsByQuery$ } from './ingredient-tag.effects';

// ----------------------------------------------------------------------------
// routes
// ----------------------------------------------------------------------------
/**
 * Combined routes for ingredient tags
 */
export const ingredientsTagRoutes$ = combineRoutes('/tags', [
  findIngredientTagsByQuery$,
]);
