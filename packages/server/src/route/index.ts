import { combineRoutes } from '@marblejs/http';
import { apiRoute$ } from './api';
import { assetRoutes$ } from './assets';

/**
 * Combined routes
 */
export const routes$ = combineRoutes('/', [apiRoute$, assetRoutes$]);
