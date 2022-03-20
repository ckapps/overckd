import { event } from '@marblejs/core';

import { UriIdQueryDto } from '../shared/uri.codec';
import { TagByQueryDto } from './tag.type';

/**
 * Enum for query types on `tags`
 */
export enum TagQueryType {
  FindByQuery = 'TAGS.FIND_BY_QUERY',
  GetById = 'TAGS.GET_BY_ID',
  Create = 'TAGS.CREATE',
}

// ----------------------------------------------------------------------------
// Events
// ----------------------------------------------------------------------------
/**
 * Event for `findByQuery`
 */
export const FindTagByQueryEvent = event(TagQueryType.FindByQuery)(
  TagByQueryDto,
);

/**
 * Event for `getById`
 */
export const GetTagByIdEvent = event(TagQueryType.GetById)(UriIdQueryDto);

/**
 * Event for `createTag`
 */
export const CreateTagEvent = event(TagQueryType.Create)(UriIdQueryDto);
