import {
  RecipeIdFromString,
  RecipeNotFound,
  RecipePreparationJson,
} from '@overckd/domain-experimental';
import { HttpApiEndpoint, HttpApiGroup, OpenApi } from 'effect/http-api';

export class RecipeApi extends HttpApiGroup.make('recipe')
  .add(
    HttpApiEndpoint.get('findById', '/:id', {
      params: { id: RecipeIdFromString },
      success: RecipePreparationJson,
      error: RecipeNotFound,
    }),
  )
  .prefix('/recipes')
  .annotateMerge(
    OpenApi.annotations({
      title: 'Recipes',
      description: 'Manage recipes',
    }),
  ) {}
