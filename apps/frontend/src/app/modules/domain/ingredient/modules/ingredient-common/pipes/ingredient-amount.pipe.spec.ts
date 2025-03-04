import { LOCALE_ID } from '@angular/core';
import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';
import { RecipeIngredient } from '@overckd/domain';
import { IngredientAmountPipe } from './ingredient-amount.pipe';

describe('IngredientAmountPipe', () => {
  let spectator: SpectatorPipe<IngredientAmountPipe>;
  const createPipe = createPipeFactory(IngredientAmountPipe);

  const ingredient: RecipeIngredient = {
    name: 'Test Ingredient',
    amount: '123',
  };

  it('should use amount as is if it is not a number', () => {
    spectator = createPipe(`{{ ingredient | ingredientAmount }}`, {
      hostProps: {
        ingredient,
      },
      providers: [
        {
          provide: LOCALE_ID,
          useValue: 'en',
        },
      ],
    });
    expect(spectator.element).toHaveText(ingredient.amount as string);
  });
});
