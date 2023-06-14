import * as t from 'io-ts';
import { timeUnit } from '../units';

export const recipeTimerId = t.string;
export const recipeTimer = t.intersection([
  t.type({
    duration: t.number,
  }),
  t.partial({
    units: timeUnit,
  }),
]);

export type RecipeTimerDTO = t.TypeOf<typeof recipeTimer>;
