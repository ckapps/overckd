import { combineEffects } from '@marblejs/core';

import { getByIdEffect } from './get-by-id.effect';

export * from './tag.query';
export * from './tag.type';

/**
 * Effects for the tag events
 */
const tagEventEffects = [getByIdEffect];

/**
 * Combined effects
 */
export const tagEventEffects$ = combineEffects(...tagEventEffects);
