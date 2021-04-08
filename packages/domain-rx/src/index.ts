import { combineEffects } from '@marblejs/core';

import {
  ingredientEventEffects$,
  recipeCollectionEventEffects$,
  recipeEventEffects$,
  tagEventEffects$,
} from './models';

// Export all the domain related
export * from './models';

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
