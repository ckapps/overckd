import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { Recipe } from '@overckd/domain';
import { RecipeComponent } from './recipe.component';

describe('RecipeComponent', () => {
  let spectator: Spectator<RecipeComponent>;
  const createComponent = createComponentFactory(RecipeComponent);

  const recipe: Partial<Recipe> = {
    name: 'mock-recipe',
    images: [],
    styles: {},
    tips: [],
    ingredients: [],
  };

  beforeEach(() => {
    spectator = createComponent({
      props: {
        recipe: recipe as Recipe,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
