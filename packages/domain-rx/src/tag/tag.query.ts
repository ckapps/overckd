import { event } from '@marblejs/core';

import { TagByQueryDto } from './tag.type';

/**
 * Enum for query types on `tags`
 */
export enum TagQueryType {
  FindByQuery = 'TAGS_FIND_BY_QUERY',
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
 * Event for `getAll`
 */
// export const GetAllRecipeCollectionsEvent = event(
//   RecipeCollectionQueryType.GetAll,
// )();
