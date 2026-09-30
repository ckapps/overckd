import {
  CollectionIdFromString,
  CollectionJson,
  CollectionNotFound,
} from '@overckd/domain-experimental';
import { Schema } from 'effect';
import {
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSchema,
  OpenApi,
} from 'effect/http-api';

export class CollectionApi extends HttpApiGroup.make('collection')
  .add(
    HttpApiEndpoint.get('getAll', '/', {
      success: Schema.Array(CollectionJson),
    }),
  )
  .add(
    HttpApiEndpoint.get('findById', '/:id', {
      params: { id: CollectionIdFromString },
      success: CollectionJson,
      error: CollectionNotFound.pipe(HttpApiSchema.status(404)),
    }),
  )
  .prefix('/collections')
  .annotateMerge(
    OpenApi.annotations({
      title: 'Recipe Collection',
      description: 'Manage collections of recipes',
    }),
  ) {}
