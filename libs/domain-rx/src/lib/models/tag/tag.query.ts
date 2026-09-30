import { event } from '@marblejs/core';
import { UriIdQueryDto } from '../../shared/uri.codec';

/** Queries for `Tag`s. */
export enum TagQueryType {
  GetById = '@overckd.tag.query.get_by_id',
}

// ----------------------------------------------------------------------------
// Events
// ----------------------------------------------------------------------------

/**
 * Event for `getById`
 */
export const GetTagByIdEvent = event(TagQueryType.GetById)(UriIdQueryDto);
