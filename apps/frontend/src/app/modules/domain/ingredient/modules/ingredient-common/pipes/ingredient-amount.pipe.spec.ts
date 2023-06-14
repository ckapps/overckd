import { IngredientAmountPipe } from './ingredient-amount.pipe';

describe('IngredientAmountPipe', () => {
  it('create an instance', () => {
    const pipe = new IngredientAmountPipe('en');
    expect(pipe).toBeTruthy();
  });
});
