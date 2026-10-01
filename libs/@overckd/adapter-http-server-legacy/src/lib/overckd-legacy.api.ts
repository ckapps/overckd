import { CollectionApi } from '@overckd/collection/api-http';
import {
  Compat,
  RecipeIdFromString,
  RecipeNotFound,
} from '@overckd/domain-experimental';
import {
  HttpApi,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSchema,
  OpenApi,
} from 'effect/http-api';

/**
 * `RecipeApi` in the JSON of the legacy recipe page: the same URL and errors,
 * but `findById` answers with `RecipePreparationLegacyJson`.
 */
export class RecipeLegacyApi extends HttpApiGroup.make('recipe')
  .add(
    HttpApiEndpoint.get('findById', '/:id', {
      params: { id: RecipeIdFromString },
      success: Compat.RecipePreparationLegacyJson,
      error: RecipeNotFound.pipe(HttpApiSchema.status(404)),
    }),
  )
  .prefix('/recipes')
  .annotateMerge(
    OpenApi.annotations({
      title: 'Recipes',
      description: 'Manage recipes, in the JSON of the legacy recipe page',
    }),
  ) {}

/**
 * `OverckdApi` for the legacy frontend, until its recipe pages are migrated
 * (docs/migration.md, steps 2.3 and 6.10). The collection JSON is the legacy
 * JSON already.
 */
export class OverckdLegacyApi extends HttpApi.make('Overckd legacy API')
  .add(CollectionApi)
  .add(RecipeLegacyApi)
  .prefix('/api')
  .annotateMerge(OpenApi.annotations({ title: 'Overckd legacy API' })) {}
