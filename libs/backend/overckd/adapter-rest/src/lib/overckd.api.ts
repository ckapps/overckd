import { CollectionApi } from '@overckd/collection/api-http';
import { RecipeApi } from '@_backend/recipe/adapter-rest';
import { HttpApi, OpenApi } from 'effect/http-api';

export class OverckdApi extends HttpApi.make('Overckd API')
  .add(CollectionApi)
  .add(RecipeApi)
  // prefix all endpoints with /api
  .prefix('/api')
  .annotateMerge(OpenApi.annotations({ title: 'Overckd API' })) {}
