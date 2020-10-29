import { combineEffects } from '@marblejs/core';

import { getRecipeByName } from './get-by-name.effect';

// export * from './recipe.command';
// export * from './recipe.event';
export * from './recipe.query';
export * from './recipe.type';

/**
 * Effects for the recipe collection events
 */
const recipeEventEffects = [getRecipeByName];

/**
 * Combined effects
 */
export const recipeEventEffects$ = combineEffects(...recipeEventEffects);
