import * as t from 'io-ts';

import { PortionKind } from '@overckd/domain';

function portionQuantifierFromKind<T extends t.Mixed>(
  kind: PortionKind,
  codec: T,
) {
  return t.intersection([
    t.type({
      kind: t.literal(kind),
    }),
    codec,
  ]);
}

export const portionQuantifier = t.union([
  portionQuantifierFromKind(
    PortionKind.Label,
    t.type({
      label: t.string,
    }),
  ),
  portionQuantifierFromKind(
    PortionKind.Quantity,
    t.type({
      label: t.union([t.string, t.undefined]),
      count: t.number,
    }),
  ),
  portionQuantifierFromKind(
    PortionKind.Springform,
    t.type({
      diameter: t.number,
    }),
  ),
]);

type PortionQuantifierC = typeof portionQuantifier;
export type PortionQuantifierDTO = t.TypeOf<PortionQuantifierC>;
