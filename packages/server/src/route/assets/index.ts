import { combineRoutes } from '@marblejs/core';

import { getImages$ } from './images.effects';

/**
 * Combined routes for collections
 */
export const assetRoutes$ = combineRoutes('/', [getImages$]);
