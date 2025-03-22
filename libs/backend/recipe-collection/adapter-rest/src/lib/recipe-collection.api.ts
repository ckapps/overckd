import { HttpApiEndpoint, HttpApiGroup, OpenApi } from '@effect/platform';
import {
  RecipeCollectionIdFromString,
  RecipeCollectionJson,
  RecipeCollectionNotFound,
} from '@overckd/domain-experimental';
import { Schema } from 'effect';

export class RecipeCollectionApi extends HttpApiGroup.make('recipe-collection')
  .add(
    HttpApiEndpoint.get('getAll', '/').addSuccess(
      Schema.Array(RecipeCollectionJson),
    ),
  )
  .add(
    HttpApiEndpoint.get('findById', '/:id')
      .setPath(Schema.Struct({ id: RecipeCollectionIdFromString }))
      .addSuccess(RecipeCollectionJson)
      .addError(RecipeCollectionNotFound),
  )
  .prefix('/collections')
  .annotate(OpenApi.Title, 'Recipe Collection')
  .annotate(OpenApi.Description, 'Manage collections of recipes') {}
