import { event } from '@marblejs/core';
import { TagDto } from './tag.type';

/** Events for `Tag`s. */
export enum TagEventType {
  Created = '@overckd.tag.event.created',
}

export const TagCreatedEvent = event(TagEventType.Created)(TagDto);
