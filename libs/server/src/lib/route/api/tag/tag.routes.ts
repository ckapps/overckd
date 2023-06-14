import { combineRoutes } from '@marblejs/http';
import { findTagsByQuery$, getTagByUri$, createTag$ } from './tag.effects';

// ----------------------------------------------------------------------------
// routes
// ----------------------------------------------------------------------------
/**
 * Combined routes for ingredient tags
 */
export const tagRoutes$ = combineRoutes('/tags', [
  findTagsByQuery$,
  getTagByUri$,
  createTag$,
]);
