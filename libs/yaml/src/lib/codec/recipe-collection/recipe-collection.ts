import * as t from 'io-ts';

export const recipeCollection = t.type({
  id: t.string,
  name: t.string,
  description: t.string,
});
