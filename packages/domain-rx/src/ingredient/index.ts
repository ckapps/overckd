import { combineEffects } from '@marblejs/core';

import { findIngredientsByQuery } from './find-ingredients-by-query.effect';

// export * from './recipe.command';
// export * from './recipe.event';
export * from './ingredient.query';
export * from './ingredient.type';

/**
 * Effects for the recipe collection events
 */
const ingredientEventEffects = [findIngredientsByQuery];

/**
 * Combined effects
 */
export const ingredientEventEffects$ = combineEffects(
  ...ingredientEventEffects,
);
