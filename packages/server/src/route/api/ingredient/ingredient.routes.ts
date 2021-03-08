import { combineRoutes } from '@marblejs/core';

import { ingredientsTagRoutes$ } from './ingredient-tag/ingredient-tag.routes';
import { findIngredientByQuery$ } from './ingredient.effects';

// ----------------------------------------------------------------------------
// routes
// ----------------------------------------------------------------------------
/**
 * Combined routes for ingredients
 */
export const ingredientRoutes$ = combineRoutes('/ingredients', [
  findIngredientByQuery$,
  // routes from sub resources
  ingredientsTagRoutes$,
]);
