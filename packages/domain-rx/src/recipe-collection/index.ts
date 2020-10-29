import { combineEffects } from '@marblejs/core';

import { createCollection } from './create-collection.effect';
import { getById } from './get-by-id.effect';
import { getAll } from './get-all.effect';

export * from './recipe-collection.command';
export * from './recipe-collection.event';
export * from './recipe-collection.query';
export * from './recipe-collection.type';

/**
 * Effects for the recipe collection events
 */
const recipeCollectionEventEffects = [createCollection, getById, getAll];

/**
 * Combined effects
 */
export const recipeCollectionEventEffects$ = combineEffects(
  ...recipeCollectionEventEffects,
);
