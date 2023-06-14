import { event } from '@marblejs/core';
import { UriIdQueryDto } from '../../shared/uri.codec';
import { TagByQueryDto } from './tag.type';

/** Queries for `Tag`s. */
export enum TagQueryType {
  FindByQuery = '@overckd.tag.query.find_by_query',
  GetById = '@overckd.tag.query.get_by_id',
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
