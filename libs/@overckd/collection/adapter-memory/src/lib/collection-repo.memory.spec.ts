import { collectionRepoConformance } from '@overckd/testing';
import { describe } from 'vitest';
import { CollectionRepoMemory } from './collection-repo.memory';

describe('CollectionRepoMemory', () => {
  collectionRepoConformance(CollectionRepoMemory);
});
