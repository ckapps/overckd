import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CollectionComponent } from './collection.component';

describe('CollectionComponent', () => {
  let spectator: Spectator<CollectionComponent>;
  const createComponent = createComponentFactory(CollectionComponent);

  const recipeCollection = {
    id: 'mock-id',
    name: 'mock-name',
    description: 'mock-description',
    recipes: [],
  };

  beforeEach(() => {
    spectator = createComponent({
      props: {
        collection: recipeCollection,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
