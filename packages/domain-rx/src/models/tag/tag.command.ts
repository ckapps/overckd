import { event } from '@marblejs/core';
import { TagDto } from './tag.type';

/** Commands for `Tag`s. */
export enum TagCommandType {
  Create = '@overckd.tag.command.create',
}

export const CreateTagCommand = event(TagCommandType.Create)(TagDto);
