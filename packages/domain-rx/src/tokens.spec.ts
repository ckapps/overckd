import {
  IngredientRepositoryToken,
  TagRepositoryToken,
  RecipeCollectionRepositoryToken,
  RecipeRepositoryToken,
} from './tokens';

describe('tokens', () => {
  test.each([
    ['RecipeCollectionRepositoryToken', RecipeCollectionRepositoryToken],
    ['RecipeRepositoryToken', RecipeRepositoryToken],
    ['IngredientRepositoryToken', IngredientRepositoryToken],
    ['TagRepositoryToken', TagRepositoryToken],
  ])('should define token %p', (tokenName, token) => {
    expect(token).toBeDefined();
  });
});
