import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';
import {
  IngredientId,
  RecipeIngredient,
  RecipeIngredientGroup,
  UnitIngredientAmount,
} from '@overckd/domain-experimental';
import { Option } from 'effect';
import { IngredientListComponent } from './ingredient-list.component';

describe('IngredientListComponent', () => {
  let spectator: Spectator<IngredientListComponent>;
  const createComponent = createComponentFactory(IngredientListComponent);

  const ingredient = (name: string, grams: number) =>
    RecipeIngredient.make({
      uri: IngredientId.make(name.toLowerCase()),
      name,
      amount: Option.some(
        UnitIngredientAmount.make({ unit: 'g', value: grams, scaleFactor: 1 }),
      ),
      optional: false,
      alternatives: [],
    });

  const filling = RecipeIngredientGroup.make({
    name: 'filling',
    label: 'For the filling',
    ingredients: [ingredient('Jam', 150)],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        ingredients: [ingredient('Flour', 290), filling],
        amountScale: 2,
      },
    });
  });

  it('shows the groups before the other ingredients', () => {
    expect(
      spectator
        .queryAll('h6, overckd-ingredient')
        .map(el => el.textContent?.replace(/\s+/g, ' ').trim()),
    ).toEqual(['For the filling', '300 g Jam', '580 g Flour']);
  });
});
