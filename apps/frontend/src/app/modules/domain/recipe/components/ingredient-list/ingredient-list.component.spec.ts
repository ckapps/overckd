import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { RecipeIngredient } from '@overckd/domain';
import { IngredientListComponent } from './ingredient-list.component';

describe('IngredientListComponent', () => {
  let spectator: Spectator<IngredientListComponent>;
  const createComponent = createComponentFactory(IngredientListComponent);

  const ingredient: RecipeIngredient = {
    name: 'Test Ingredient',
    amount: 1,
    unit: 'g',
  };

  beforeEach(
    () =>
      (spectator = createComponent({
        props: {
          ingredients: [ingredient],
        },
      })),
  );

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
