import * as t from 'io-ts';

import { recipeCollection } from './recipe-collection';

export const recipeCollectionRecipe = t.intersection([
  t.type({
    name: t.string,
    uri: t.string,
    collections: t.array(recipeCollection),
  }),
  t.partial({
    id: t.string,
  }),
]);
