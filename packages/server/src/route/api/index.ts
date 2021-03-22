import { combineRoutes } from '@marblejs/core';

import { ingredientRoutes$ } from './ingredient';
import { recipes$ } from './recipe';
import { recipeCollectionRoutes$ } from './recipe-collection';
import { tagRoutes$ } from './tag';

/**
 * Combined routes for api
 */
export const apiRoute$ = combineRoutes('/api', [
  ingredientRoutes$,
  recipes$,
  recipeCollectionRoutes$,
  tagRoutes$,
]);
