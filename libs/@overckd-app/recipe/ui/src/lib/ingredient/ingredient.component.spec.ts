import { LOCALE_ID } from '@angular/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';
import {
  CountIngredientAmount,
  IngredientId,
  RecipeIngredient,
  UnitIngredientAmount,
} from '@overckd/domain-experimental';
import { Option } from 'effect';
import { IngredientComponent } from './ingredient.component';

describe('IngredientComponent', () => {
  let spectator: Spectator<IngredientComponent>;
  const createComponent = createComponentFactory({
    component: IngredientComponent,
    providers: [{ provide: LOCALE_ID, useValue: 'en' }],
  });

  const ingredient = (fields: Partial<RecipeIngredient>) =>
    RecipeIngredient.make({
      uri: IngredientId.make('flour'),
      name: 'Flour',
      amount: Option.none(),
      optional: false,
      alternatives: [],
      ...fields,
    });

  const text = () => spectator.element.textContent?.replace(/\s+/g, ' ').trim();

  it('shows the amount, the unit and the name', () => {
    spectator = createComponent({
      props: {
        ingredient: ingredient({
          amount: Option.some(
            UnitIngredientAmount.make({
              unit: 'g',
              value: 150,
              scaleFactor: 1,
            }),
          ),
        }),
      },
    });

    expect(text()).toBe('150 g Flour');
    expect(spectator.query('.font-weight-bold')).toHaveText('150');
  });

  it('scales the amount', () => {
    spectator = createComponent({
      props: {
        ingredient: ingredient({
          name: 'Eggs',
          amount: Option.some(
            CountIngredientAmount.make({ count: 2, scaleFactor: 1 }),
          ),
        }),
        amountScale: 0.75,
      },
    });

    expect(text()).toBe('1½ Eggs');
  });

  it('marks optional ingredients and lists the alternatives', () => {
    spectator = createComponent({
      props: {
        ingredient: ingredient({
          optional: true,
          alternatives: ['Spelt', 'Rye', 'Oat'],
        }),
      },
    });

    expect(text()).toBe('optional: Flour (alternativ: Spelt, Rye oder Oat)');
  });
});
