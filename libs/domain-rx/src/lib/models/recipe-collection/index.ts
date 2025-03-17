import { combineEffects } from '@marblejs/core';

import { getAll } from './get-all.effect';
import { getById } from './get-by-id.effect';

export * from './recipe-collection.query';
export * from './recipe-collection.type';

/**
 * Effects for the recipe collection events
 */
const recipeCollectionEventEffects = [getById, getAll];

/**
 * Combined effects
 */
export const recipeCollectionEventEffects$ = combineEffects(
  ...recipeCollectionEventEffects,
);
