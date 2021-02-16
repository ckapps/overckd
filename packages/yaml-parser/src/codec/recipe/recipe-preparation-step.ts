import * as t from 'io-ts';
import { recipeTimerId } from './recipe-timer';

export const detailedWithText = t.type({
  text: t.string,
});

const detailedWithHtml = t.type({
  html: t.string,
});

const detailedBase = t.partial({
  styles: t.array(t.string),
  timers: t.partial({
    start: t.array(recipeTimerId),
    await: t.array(recipeTimerId),
  }),
});

export const recipePreparationStep = t.union([
  t.string,
  detailedBase,
  t.union([detailedWithHtml, detailedWithText]),
]);
