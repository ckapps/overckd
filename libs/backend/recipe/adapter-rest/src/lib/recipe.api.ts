import * as HttpApiEndpoint from '@effect/platform/HttpApiEndpoint';
import * as HttpApiGroup from '@effect/platform/HttpApiGroup';
import * as OpenApi from '@effect/platform/OpenApi';
import {
  RecipeIdFromString,
  RecipeNotFound,
  RecipePreparationJson,
} from '@overckd/domain-experimental';
import * as Schema from 'effect/Schema';

export class RecipeApi extends HttpApiGroup.make('recipe')
  .add(
    HttpApiEndpoint.get('findById', '/:id')
      .setPath(Schema.Struct({ id: RecipeIdFromString }))
      .addSuccess(RecipePreparationJson)
      .addError(RecipeNotFound),
  )
  .prefix('/recipes')
  .annotate(OpenApi.Title, 'Recipes')
  .annotate(OpenApi.Description, 'Manage recipes') {}
