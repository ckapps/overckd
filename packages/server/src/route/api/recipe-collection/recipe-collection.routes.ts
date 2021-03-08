import { combineRoutes } from '@marblejs/core';

import {
  getCollections$,
  postRecipeCollection$,
  getCollectionsById$,
} from './recipe-collection.effects';

// ----------------------------------------------------------------------------
// routes
// ----------------------------------------------------------------------------
/**
 * Combined routes for collections
 */
export const recipeCollectionRoutes$ = combineRoutes('/collections', [
  getCollections$,
  postRecipeCollection$,
  getCollectionsById$,
]);
