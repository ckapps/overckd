import { combineRoutes } from '@marblejs/http';
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
