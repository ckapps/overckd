import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RecipeCollectionComponent } from './recipe-collection.component';

describe('RecipeCollectionComponent', () => {
  let spectator: Spectator<RecipeCollectionComponent>;
  const createComponent = createComponentFactory(RecipeCollectionComponent);

  const recipeCollection = {
    id: 'mock-id',
    name: 'mock-name',
    description: 'mock-description',
    recipes: [],
  };

  beforeEach(() => {
    spectator = createComponent({
      props: {
        recipeCollection,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
