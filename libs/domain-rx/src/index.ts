import { combineEffects } from '@marblejs/core';

import {
  ingredientEventEffects$,
  recipeCollectionEventEffects$,
  recipeEventEffects$,
  tagEventEffects$,
} from './lib/models';

// Export all the domain related
export * from './lib/models';
export * from './lib/search/index';
export * from './lib/shared/uri.codec';
export * from './lib/tokens';

/**
 * Domain related event effects
 */
export const domainEventEffects$ = combineEffects(
  ingredientEventEffects$,
  recipeEventEffects$,
  recipeCollectionEventEffects$,
  tagEventEffects$,
);
