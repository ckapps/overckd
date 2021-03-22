import { combineEffects } from '@marblejs/core';

import { createTagEffect } from './create-tag.effect';
import { findTagsByQuery } from './find-tags-by-query.effect';
import { getByIdEffect } from './get-by-id.effect';

export * from './tag.command';
export * from './tag.event';
export * from './tag.query';
export * from './tag.type';

/**
 * Effects for the tag events
 */
const tagEventEffects = [createTagEffect, findTagsByQuery, getByIdEffect];

/**
 * Combined effects
 */
export const tagEventEffects$ = combineEffects(...tagEventEffects);
