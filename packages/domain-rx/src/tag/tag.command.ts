import { event } from '@marblejs/core';

import { TagDto } from './tag.type';

export enum TagCommandType {
  Create = 'TAG.CREATE',
}

export const CreateTagCommand = event(TagCommandType.Create)(TagDto);
