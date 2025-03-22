import { HttpApiEndpoint, HttpApiGroup, OpenApi } from '@effect/platform';
import {
  CollectionIdFromString,
  CollectionJson,
  CollectionNotFound,
} from '@overckd/domain-experimental';
import { Schema } from 'effect';

export class CollectionApi extends HttpApiGroup.make('recipe-collection')
  .add(
    HttpApiEndpoint.get('getAll', '/').addSuccess(Schema.Array(CollectionJson)),
  )
  .add(
    HttpApiEndpoint.get('findById', '/:id')
      .setPath(Schema.Struct({ id: CollectionIdFromString }))
      .addSuccess(CollectionJson)
      .addError(CollectionNotFound),
  )
  .prefix('/collections')
  .annotate(OpenApi.Title, 'Recipe Collection')
  .annotate(OpenApi.Description, 'Manage collections of recipes') {}
