import { CollectionApi } from '@_backend/collection/adapter-rest';
import { RecipeApi } from '@_backend/recipe/adapter-rest';
import * as HttpApi from '@effect/platform/HttpApi';
import * as OpenApi from '@effect/platform/OpenApi';

export class OverckdApi extends HttpApi.make('Overckd API')
  .add(CollectionApi)
  .add(RecipeApi)
  // prefix all endpoints with /api
  .prefix('/api')
  .annotate(OpenApi.Title, 'Overckd API') {}
