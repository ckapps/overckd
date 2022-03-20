import { combineEffects } from '@marblejs/core';

import { getRecipeByNameEffect } from './get-by-name.effect';

// export * from './recipe.command';
// export * from './recipe.event';
export * from './recipe.query';
export * from './recipe.type';

/**
 * Effects for the recipe events
 */
const recipeEventEffects = [getRecipeByNameEffect];

/**
 * Combined effects
 */
export const recipeEventEffects$ = combineEffects(...recipeEventEffects);
