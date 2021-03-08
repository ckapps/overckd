import { combineEffects } from '@marblejs/core';

import { ingredientEventEffects$ } from './ingredient';
import { ingredientTagEventEffects$ } from './ingredient-tag';
import { recipeEventEffects$ } from './recipe';
import { recipeCollectionEventEffects$ } from './recipe-collection';

// Export all the domain related
export * from './ingredient';
export * from './ingredient-tag';
export * from './recipe';
export * from './recipe-collection';

// Export the DI tokens
export * from './tokens';

/**
 * Domain related event effects
 */
export const domainEventEffects$ = combineEffects(
  ingredientEventEffects$,
  ingredientTagEventEffects$,
  recipeEventEffects$,
  recipeCollectionEventEffects$,
);
