import { combineRoutes } from '@marblejs/http';
import { getTagByUri$ } from './tag.effects';

// ----------------------------------------------------------------------------
// routes
// ----------------------------------------------------------------------------
/**
 * Combined routes for ingredient tags
 */
export const tagRoutes$ = combineRoutes('/tags', [getTagByUri$]);
