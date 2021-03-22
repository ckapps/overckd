import { event } from '@marblejs/core';

import { TagDto } from './tag.type';

export enum TagEventType {
  Created = 'TAG.CREATED',
}

export const TagCreatedEvent = event(TagEventType.Created)(TagDto);
