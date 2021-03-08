import { combineEffects } from '@marblejs/core';

import { findIngredientTagsByQuery } from './find-ingredient-tags-by-query.effect';

// export * from './recipe.command';
// export * from './recipe.event';
export * from './ingredient-tag.query';
export * from './ingredient-tag.type';

/**
 * Effects for the recipe collection events
 */
const ingredientTagEventEffects = [findIngredientTagsByQuery];

/**
 * Combined effects
 */
export const ingredientTagEventEffects$ = combineEffects(
  ...ingredientTagEventEffects,
);
