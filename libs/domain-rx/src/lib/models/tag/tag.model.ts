import { Tag } from '@overckd/domain';

import { TagDto } from './tag.type';

export function createTag(dto: TagDto): Tag {
  const { label, uri, color, icon } = dto;

  return {
    label,
    uri,
    color,
    icon,
  };
}
