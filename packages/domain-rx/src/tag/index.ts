import { combineEffects } from '@marblejs/core';

import { findTagsByQuery } from './find-tags-by-query.effect';

// export * from './recipe.command';
// export * from './recipe.event';
export * from './tag.query';
export * from './tag.type';

/**
 * Effects for the tag events
 */
const tagEventEffects = [findTagsByQuery];

/**
 * Combined effects
 */
export const tagEventEffects$ = combineEffects(...tagEventEffects);
