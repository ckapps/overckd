import { recipeRepoConformance } from '@overckd/testing';
import { describe } from 'vitest';
import { RecipeRepoMemory } from './recipe-repo.memory';

describe('RecipeRepoMemory', () => {
  recipeRepoConformance(RecipeRepoMemory);
});
