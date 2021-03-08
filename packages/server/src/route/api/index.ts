import { combineRoutes } from '@marblejs/core';

import { ingredientRoutes$ } from './ingredient';
import { recipes$ } from './recipe';
import { recipeCollectionRoutes$ } from './recipe-collection';

/**
 * Combined routes for api
 */
export const apiRoute$ = combineRoutes('/api', [
  ingredientRoutes$,
  recipes$,
  recipeCollectionRoutes$,
]);
