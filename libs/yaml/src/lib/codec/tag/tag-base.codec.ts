import * as t from 'io-ts';

import { overckdUri } from '../shared/overckd-uri';

export const tagBaseIcon = t.string;

export const tagBase = t.intersection([
  t.type({
    uri: overckdUri,
    label: t.string,
  }),
  t.partial({
    color: t.string,
    icon: tagBaseIcon,
  }),
]);

type TagBaseC = typeof tagBase;
export type TagBaseDTO = t.TypeOf<TagBaseC>;
