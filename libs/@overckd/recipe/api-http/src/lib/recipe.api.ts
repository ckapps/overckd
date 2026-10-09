import {
  RecipeIdFromString,
  RecipeNotFound,
  RecipePreparationJson,
} from '@overckd/domain';
import {
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSchema,
  OpenApi,
} from 'effect/http-api';

export class RecipeApi extends HttpApiGroup.make('recipe')
  .add(
    HttpApiEndpoint.get('findById', '/:id', {
      params: { id: RecipeIdFromString },
      success: RecipePreparationJson,
      error: RecipeNotFound.pipe(HttpApiSchema.status(404)),
    }),
  )
  .prefix('/recipes')
  .annotateMerge(
    OpenApi.annotations({
      title: 'Recipes',
      description: 'Manage recipes',
    }),
  ) {}
