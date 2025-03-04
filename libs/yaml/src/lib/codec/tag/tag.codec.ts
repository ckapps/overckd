import * as t from 'io-ts';

import { tagBase } from './tag-base.codec';

export const tag = tagBase;

type TagC = typeof tag;
export type TagDTO = t.TypeOf<TagC>;
