import * as t from 'io-ts';

export const timeUnit = t.keyof({
  s: null,
  m: null,
  h: null,
});

export type TimeUnitDTO = t.TypeOf<typeof timeUnit>;
