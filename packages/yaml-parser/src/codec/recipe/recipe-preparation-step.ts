import * as t from 'io-ts';

export const detailedWithText = t.type({
  text: t.string,
});

const detailedWithHtml = t.type({
  html: t.string,
});

const detailedBase = t.partial({
  styles: t.array(t.string),
});

export const recipePreparationStep = t.union([
  t.string,
  detailedBase,
  t.union([detailedWithHtml, detailedWithText]),
]);
