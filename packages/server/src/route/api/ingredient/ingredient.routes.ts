import { combineRoutes } from '@marblejs/core';

import { findIngredientByQuery$ } from './ingredient.effects';

// ----------------------------------------------------------------------------
// routes
// ----------------------------------------------------------------------------
/**
 * Combined routes for ingredients
 */
export const ingredientRoutes$ = combineRoutes('/ingredients', [
  findIngredientByQuery$,
]);
