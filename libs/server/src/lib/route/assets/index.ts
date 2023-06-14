import { combineRoutes } from '@marblejs/http';
import { getImages$ } from './images.effects';

/**
 * Combined routes for collections
 */
export const assetRoutes$ = combineRoutes('/', [getImages$]);
