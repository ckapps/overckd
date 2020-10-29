import { combineRoutes } from '@marblejs/core';

import { recipes$ } from './recipe';
import { collections$ } from './recipe-collection';

/**
 * Combined routes for api
 */
export const apiRoute$ = combineRoutes('/api', [collections$, recipes$]);
