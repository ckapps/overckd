import { combineEffects } from '@marblejs/core';

import { ingredientEventEffects$ } from './ingredient';
import { recipeEventEffects$ } from './recipe';
import { recipeCollectionEventEffects$ } from './recipe-collection';
import { tagEventEffects$ } from './tag';

// Export all the domain related
export * from './ingredient';
export * from './recipe';
export * from './recipe-collection';
export * from './tag';

// Export the DI tokens
export * from './tokens';

/**
 * Domain related event effects
 */
export const domainEventEffects$ = combineEffects(
  ingredientEventEffects$,
  recipeEventEffects$,
  recipeCollectionEventEffects$,
  tagEventEffects$,
);
