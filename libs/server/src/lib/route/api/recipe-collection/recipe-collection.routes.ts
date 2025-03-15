import { combineRoutes } from '@marblejs/http';
import {
  getCollections$,
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
  getCollectionsById$,
]);
