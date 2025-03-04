import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { IngredientComponent } from './ingredient.component';

describe('IngredientComponent', () => {
  let spectator: Spectator<IngredientComponent>;
  const createComponent = createComponentFactory(IngredientComponent);

  const mockIngredient = {
    name: 'mock-ingredient',

    amount: 123,
    unit: 'g',
    scaleFactor: 1,

    optional: false,
    alternatives: [],
  };
  beforeEach(
    () =>
      (spectator = createComponent({
        props: {
          ingredient: mockIngredient,
        },
      })),
  );

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
