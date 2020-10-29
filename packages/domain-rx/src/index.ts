import { combineEffects } from '@marblejs/core';

import { recipeEventEffects$ } from './recipe';
import { recipeCollectionEventEffects$ } from './recipe-collection';

// Export all the domain related
export * from './recipe';
export * from './recipe-collection';

// Export the DI tokens
export * from './tokens';

/**
 * Domain related event effects
 */
export const domainEventEffects$ = combineEffects(
  recipeEventEffects$,
  recipeCollectionEventEffects$,
);
