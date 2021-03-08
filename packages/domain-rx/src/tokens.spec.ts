import {
  IngredientRepositoryToken,
  IngredientTagRepositoryToken,
  RecipeCollectionRepositoryToken,
  RecipeRepositoryToken,
} from './tokens';

describe('tokens', () => {
  test.each([
    ['RecipeCollectionRepositoryToken', RecipeCollectionRepositoryToken],
    ['RecipeRepositoryToken', RecipeRepositoryToken],
    ['IngredientRepositoryToken', IngredientRepositoryToken],
    ['IngredientTagRepositoryToken', IngredientTagRepositoryToken],
  ])('should define token %p', (tokenName, token) => {
    expect(token).toBeDefined();
  });
});
