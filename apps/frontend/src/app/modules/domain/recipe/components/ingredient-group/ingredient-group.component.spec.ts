import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { IngredientGroupComponent } from './ingredient-group.component';

describe('IngredientGroupComponent', () => {
  let spectator: Spectator<IngredientGroupComponent>;
  const createComponent = createComponentFactory(IngredientGroupComponent);

  const ingredientGroup = {
    group: 'mock-group',
    label: 'mock-label',
    ingredients: [{ name: 'mock-ingredient' }],
  };

  beforeEach(() => {
    spectator = createComponent({
      props: {
        ingredientGroup,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
