import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { CollectionRecipeListComponent } from './collection-recipe-list.component';

describe('CollectionRecipeListComponent', () => {
  let spectator: Spectator<CollectionRecipeListComponent>;
  const createComponent = createComponentFactory(CollectionRecipeListComponent);

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
