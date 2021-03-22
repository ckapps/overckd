import { event } from '@marblejs/core';

import { UriIdQueryDto } from '../shared/uri.codec';
import { TagByQueryDto } from './tag.type';

/**
 * Enum for query types on `tags`
 */
export enum TagQueryType {
  FindByQuery = 'TAGS.FIND_BY_QUERY',
  GetById = 'TAGS.GET_BY_ID',
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
 * Event for `getAll`
 */
// export const GetAllRecipeCollectionsEvent = event(
//   RecipeCollectionQueryType.GetAll,
// )();
