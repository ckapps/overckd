import {
  CollectionIdFromString,
  CollectionJson,
  CollectionNotFound,
} from '@overckd/domain-experimental';
import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup, OpenApi } from 'effect/http-api';

export class CollectionApi extends HttpApiGroup.make('recipe-collection')
  .add(
    HttpApiEndpoint.get('getAll', '/', {
      success: Schema.Array(CollectionJson),
    }),
  )
  .add(
    HttpApiEndpoint.get('findById', '/:id', {
      params: { id: CollectionIdFromString },
      success: CollectionJson,
      error: CollectionNotFound,
    }),
  )
  .prefix('/collections')
  .annotateMerge(
    OpenApi.annotations({
      title: 'Recipe Collection',
      description: 'Manage collections of recipes',
    }),
  ) {}
