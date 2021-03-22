import { combineRoutes } from '@marblejs/core';

import { findTagsByQuery$ } from './tag.effects';

// ----------------------------------------------------------------------------
// routes
// ----------------------------------------------------------------------------
/**
 * Combined routes for ingredient tags
 */
export const tagRoutes$ = combineRoutes('/tags', [findTagsByQuery$]);
